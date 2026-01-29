function generateRandomChallenge() {
  const length = 32;
  const randomValues = new Uint8Array(length);
  window.crypto.getRandomValues(randomValues);
  return randomValues;
}

interface ConfigCreatePasskey {
  rpName: string;
  unSupportedAlertText: string;
}

interface CreatePasskeyParams {
  name: string;
  displayName: string;
  configs?: ConfigCreatePasskey;
}

async function createPasskey({
  name,
  displayName,
  configs,
}: CreatePasskeyParams) {
  const Window = window as any;
  if (
    !navigator.credentials ||
    !navigator.credentials.create ||
    !navigator.credentials.get
  ) {
    return alert(configs?.unSupportedAlertText || 'Your browser does not support the Web Authentication API');
  }

  const credentials = await navigator.credentials.create({
    publicKey: {
      challenge: generateRandomChallenge(),
      rp: { name: configs?.rpName || 'Waheim', id: Window.location.hostname },
      //here you'll want to pass the user's info
      user: { id: new Uint8Array(16).fill(1), name, displayName },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },
        { type: 'public-key', alg: -257 },
      ],
      timeout: 60000,
      authenticatorSelection: {
        residentKey: 'preferred',
        requireResidentKey: false,
        userVerification: 'preferred',
      },
      attestation: 'none',
      extensions: { credProps: true },
    },
  });
  //in a real app, you'll store the credentials against the user's profile in your DB
  //here we'll just save it in a global variable
  Window.currentPasskey = credentials;
}

async function verifyPasskey() {
  const Window = window as any;
  try {
    //to verify a user's credentials, we simply pass the
    //unique ID of the passkey we saved against the user profile
    //in this demo, we just saved it in a global variable
    await navigator.credentials.get({
      publicKey: {
        challenge: generateRandomChallenge(),
        allowCredentials: [
          { type: 'public-key', id: Window.currentPasskey.rawId },
        ],
      },
    });
    alert('Biometric authentication successful!');
  } catch (err) {
    alert(err);
  }
}

export { createPasskey, verifyPasskey };

function useBiometric() {
  return { createPasskey, verifyPasskey };
}

export default useBiometric;
export { useBiometric };
