import { createFileRoute } from '@tanstack/react-router';
import useBiometric from '../___shared/hooks/common/use-biometric';

export const Route = createFileRoute('/biometric/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { createPasskey, verifyPasskey } = useBiometric();
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          padding: 24,
          borderRadius: 12,
          background: '#111',
          color: '#fff',
          width: 320,
        }}
      >
        <h2>Biometric Authentication</h2>

        <button
          type="button"
          id="authenticate-btn"
          onClick={() => {
            createPasskey({
              name: 'johndoe',
              displayName: 'John Doe',
              configs: {
                rpName: 'My Awesome App',
                unSupportedAlertText: 'This client not run in https',
              },
            });
          }}
          style={{ width: '100%', padding: 12, marginTop: 12 }}
        >
          Create Passkey
        </button>

        <button
          type="button"
          id="verify-btn"
          onClick={() => verifyPasskey()}
          className="disabled"
          style={{ width: '100%', padding: 12, marginTop: 12, opacity: 0.5 }}
        >
          Verify Passkey
        </button>
      </div>
    </div>
  );
}
