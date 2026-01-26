import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/biometric/')({
  component: RouteComponent,
})

// --------------------
// YOUR ORIGINAL LOGIC
// --------------------

//the challenge is a crucial part of the authentication process, 
//and is used to mitigate "replay attacks" and allow server-side authentication
//in a real app, you'll want to generate the challenge server-side and 
//maintain a session or temporary record of this challenge in your DB
function generateRandomChallenge() {
    let length = 32;
    let randomValues = new Uint8Array(length);
    window.crypto.getRandomValues(randomValues);
    return randomValues;
}

async function createPasskey(){
  const Window = window as any;
  const Document = document as any;
  if (!navigator.credentials || !navigator.credentials.create || !navigator.credentials.get){
    return alert("Your browser does not support the Web Authentication API");
  }
  
  let credentials = await navigator.credentials.create({
      publicKey: {
        challenge: generateRandomChallenge(),
        rp: { name: "Progressier", id: Window.location.hostname },
        //here you'll want to pass the user's info
        user: { id: new Uint8Array(16).fill(1), name: "johndoe@example.com", displayName: "John Doe"},
        pubKeyCredParams: [
            { type: "public-key", alg: -7 },
            { type: "public-key", alg: -257 }
        ],
        timeout: 60000,
        authenticatorSelection: {residentKey: "preferred", requireResidentKey: false, userVerification: "preferred"},
        attestation: "none",
        extensions: { credProps: true }
      }
  });
  //in a real app, you'll store the credentials against the user's profile in your DB
  //here we'll just save it in a global variable
  Window.currentPasskey = credentials;
  console.log(credentials);

  //we update our demo buttons
  Document.getElementById("authenticate-btn").innerHTML = "Authenticated";
  Document.getElementById("authenticate-btn").classList.add("disabled"); 
  Document.getElementById("verify-btn").classList.remove("disabled");
}

async function verifyPasskey(){
  const Window = window as any;
  try {
    //to verify a user's credentials, we simply pass the 
    //unique ID of the passkey we saved against the user profile
    //in this demo, we just saved it in a global variable
    let credentials = await navigator.credentials.get({
        publicKey: {
          challenge: generateRandomChallenge(),
          allowCredentials: [{ type: "public-key", id: Window.currentPasskey.rawId }]
        }
    });
    console.log(credentials);  
    alert("Biometric authentication successful!");
  }
  catch(err){
    alert(err);
  }
}

// --------------------
// PAGE COMPONENT
// --------------------
function RouteComponent() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ padding: 24, borderRadius: 12, background: '#111', color: '#fff', width: 320 }}>
        <h2>Biometric Authentication</h2>

        <button
          id="authenticate-btn"
          onClick={createPasskey}
          style={{ width: '100%', padding: 12, marginTop: 12 }}
        >
          Create Passkey
        </button>

        <button
          id="verify-btn"
          onClick={verifyPasskey}
          className="disabled"
          style={{ width: '100%', padding: 12, marginTop: 12, opacity: 0.5 }}
        >
          Verify Passkey
        </button>
      </div>
    </div>
  )
}
