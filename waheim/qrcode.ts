import type { RsbuildPlugin } from '@rsbuild/core';
import { exec } from 'child_process';
import os from 'os';
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
  // Use Node's os.networkInterfaces for cross‑platform reliability
  const interfacesObj = os.networkInterfaces();
  const results: NetworkInterface[] = [];

  for (const [name, infos] of Object.entries(interfacesObj)) {
    if (!infos) continue;
    for (const info of infos) {
      // Skip internal (loopback) interfaces unless they have a useful address
      const isInternal = info.internal;
      const address = info.address;
      const family = info.family as 'IPv4' | 'IPv6';
      const netmask = info.netmask;
      const mac = info.mac;

      // Build CIDR if possible
      const cidr =
        netmask && address ? `${address}/${netmaskToCIDR(netmask)}` : '';

      results.push({
        address,
        netmask,
        family,
        mac,
        internal: isInternal,
        cidr,
      });
    }
  }

  // Filter out empty entries (shouldn't happen) and ensure at least one fallback
  if (results.length === 0) {
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
  return results;
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
