import { utils } from '@passwordless-id/webauthn';

export const buildCredential = (
  challenge: string,
  username: string
): CredentialCreationOptions => ({
  publicKey: {
    // Challenge that the authenticator must sign
    challenge: Uint8Array.from(challenge, (c) => c.codePointAt(0)!),

    // Information about relying party
    rp: {
      // The ID of the relying party, will be validated on the server
      // Also acts as the "scope" of the credential
      id: window.location.hostname,
      // A user-friendly name for the app, visible in some authenticator UIs
      name: 'My App name',
    },

    // Options for the public key
    pubKeyCredParams: [
      // ES256 (Webauthn's default algorithm)
      { alg: -7, type: 'public-key' },
      // RS256 (for Windows Hello)
      { alg: -257, type: 'public-key' },
    ],

    // Time (seconds) after which the operation will be aborted
    timeout: 60_000,

    // Options for the authenticator device
    authenticatorSelection: {
      // Requires the authenticator device to validate the user (through PIN, fingerprint, etc.)
      userVerification: 'required',
      // Allow the credential to exist on a "roaming" authenticator device, like a phone or YubiKey
      authenticatorAttachment: 'cross-platform',
      // Allow the user to choose between multiple accounts on the authenticator device
      residentKey: 'required',
    },

    // Whether we want information about the authenticator device
    // https://w3c.github.io/webauthn/#enum-attestation-convey
    attestation: 'none',

    // Info about the user that is trying to register, none of this is sent to the server
    user: {
      // A unique ID for the user record in the authenticator device
      id: Uint8Array.from(crypto.randomUUID(), (c) => c.codePointAt(0)!),
      // A Duo of name fields for the user record in the authenticator device
      // Most authenticator devices will display these to the user
      // UI will be simplified when both are the same
      name: username,
      displayName: username,
    },
  },
});

export const buildGetCredential = (
  challenge: string
): CredentialRequestOptions => ({
  publicKey: {
    // Challenge that the authenticator must sign
    challenge: Uint8Array.from(challenge, (c) => c.codePointAt(0)!),

    // The ID of the relying party, will be validated on the server
    // Also acts as the "scope" of the credential
    rpId: window.location.hostname,

    // Specify specific users that are allowed to authenticate
    // Useful for 2FA
    // Or leave empty to allow any user
    allowCredentials: [],

    // Time (seconds) after which the operation will be aborted
    timeout: 60_000,

    // Requires the authenticator device to validate the user (through PIN, fingerprint, etc.)
    userVerification: 'required',
  },
});

function getAlgoName(number_: number) {
  switch (number_) {
    case -7: {
      return 'ES256';
    }
    case -257: {
      return 'RS256';
    }
    default: {
      throw new Error(`Unknown algorithm code: ${number_}`);
    }
  }
}

export const encodeCredential = (
  id: string,
  username: string,
  response: AuthenticatorAttestationResponse
) =>
  JSON.stringify({
    credential: {
      id,
      publicKey: utils.toBase64url(response.getPublicKey()!),
      algorithm: getAlgoName(response.getPublicKeyAlgorithm()!),
    },
    authenticatorData: utils.toBase64url(response.getAuthenticatorData()),
    clientData: utils.toBase64url(response.clientDataJSON),
    username,
  });

export const encodeGetCredential = (
  id: string,
  response: AuthenticatorAssertionResponse
) =>
  JSON.stringify({
    credentialId: id,
    authenticatorData: utils.toBase64url(response.authenticatorData),
    clientData: utils.toBase64url(response.clientDataJSON),
    signature: utils.toBase64url(response.signature),
  });
