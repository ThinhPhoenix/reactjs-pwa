import type { RsbuildPlugin } from '@rsbuild/core';
import { exec } from 'child_process';
import qrcode from 'qrcode-terminal';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface NetworkInterface {
  address: string;
  netmask: string;
  family: 'IPv4' | 'IPv6';
  mac: string;
  internal: boolean;
  cidr: string;
}

export async function getNetworkIPs(): Promise<NetworkInterface[]> {
  try {
    const { stdout } = await execAsync('ipconfig');
    const lines = stdout.split('\n');
    const interfaces: NetworkInterface[] = [];

    let currentInterface: Partial<NetworkInterface> = {};
    let inAdapter = false;

    for (const line of lines) {
      const trimmed = line.trim();

      if (
        trimmed.startsWith('Ethernet adapter') ||
        trimmed.startsWith('Wireless LAN adapter') ||
        trimmed.startsWith('adapter')
      ) {
        if (currentInterface.address) {
          interfaces.push(currentInterface as NetworkInterface);
        }
        currentInterface = {
          address: '',
          netmask: '',
          family: 'IPv4' as const,
          mac: '',
          internal: false,
          cidr: '',
        };
        inAdapter = true;
        continue;
      }

      if (!inAdapter) continue;

      if (trimmed.includes('IPv4 Address')) {
        const match = trimmed.match(
          /IPv4 Address[.\s]*:\s*([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/,
        );
        if (match && match[1]) {
          currentInterface.address = match[1];
          currentInterface.family = 'IPv4';
        }
      }

      if (trimmed.includes('Subnet Mask')) {
        const match = trimmed.match(
          /Subnet Mask[.\s]*:\s*([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/,
        );
        if (match && match[1]) {
          currentInterface.netmask = match[1];
        }
      }

      if (trimmed.includes('Physical Address')) {
        const match = trimmed.match(
          /Physical Address[.\s]*:\s*([0-9A-Fa-f-]{17})/,
        );
        if (match && match[1]) {
          currentInterface.mac = match[1];
        }
      }

      if (trimmed.includes('IPv6 Address')) {
        const match = trimmed.match(/IPv6 Address[.\s]*:\s*([0-9A-Fa-f:]+)/);
        if (match && match[1]) {
          const ipv6Interface = {
            address: match[1],
            netmask: '',
            family: 'IPv6' as const,
            mac: currentInterface.mac || '',
            internal: false,
            cidr: '',
          };
          interfaces.push(ipv6Interface);
        }
      }
    }

    if (currentInterface.address) {
      interfaces.push(currentInterface as NetworkInterface);
    }

    interfaces.forEach((iface) => {
      if (iface.address && iface.netmask) {
        iface.cidr = `${iface.address}/${netmaskToCIDR(iface.netmask)}`;
      }
      iface.internal =
        !iface.address ||
        (!iface.address.startsWith('192.') &&
          !iface.address.startsWith('10.') &&
          !iface.address.startsWith('172.'));
    });

    return interfaces.length > 0
      ? interfaces
      : [
        {
          address: '192.168.1.100',
          netmask: '255.255.255.0',
          family: 'IPv4',
          mac: '00-00-00-00-00-00',
          internal: false,
          cidr: '192.168.1.100/24',
        },
      ];
  } catch (error) {
    console.error('Error getting network IPs:', error);
    return [
      {
        address: '192.168.1.100',
        netmask: '255.255.255.0',
        family: 'IPv4',
        mac: '00-00-00-00-00-00',
        internal: false,
        cidr: '192.168.1.100/24',
      },
    ];
  }
}

function netmaskToCIDR(netmask: string): number {
  const parts = netmask.split('.').map(Number);
  let cidr = 0;
  for (const part of parts) {
    if (part === 255) {
      cidr += 8;
    } else if (part > 0 && part < 255) {
      let binary = part.toString(2);
      binary = binary.padStart(8, '0');
      cidr += binary.split('1').length - 1;
    }
  }
  return cidr;
}

export function createQRPlugin(expectedPort: number = 3000): RsbuildPlugin {
  return {
    name: 'qrcode-plugin',
    setup(api) {
      api.onAfterBuild(async () => {
        const config = api.getRsbuildConfig();
        const actualPort = config.server?.port || expectedPort;
        const networkInterfaces = await getNetworkIPs();
        const primaryInterface =
          networkInterfaces.find((iface) => iface.address.startsWith('192.')) ||
          networkInterfaces[0];
        qrcode.generate(`http://${primaryInterface.address}:${actualPort}`, {
          small: true,
        });
      });

      api.onAfterDevCompile(async ({ isFirstCompile }) => {
        if (isFirstCompile) {
          const config = api.getRsbuildConfig();
          const actualPort = config.server?.port || expectedPort;
          const networkInterfaces = await getNetworkIPs();
          const primaryInterface =
            networkInterfaces.find((iface) =>
              iface.address.startsWith('192.'),
            ) || networkInterfaces[0];
          qrcode.generate(`http://${primaryInterface.address}:${actualPort}`, {
            small: true,
          });
        }
      });
    },
  };
}
