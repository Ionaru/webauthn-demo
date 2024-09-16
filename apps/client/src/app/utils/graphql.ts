import { $ } from '../zeus';
import { typedGql } from '../zeus/typedDocumentNode';

export const sessionQuery = typedGql('query')({
  session: {
    user: true,
  },
});

export const createChallengeMutation = typedGql('mutation')({
  createChallenge: true,
});

export const loginMutation = typedGql('mutation')({
  loginUser: [
    {
      id: $('id', 'String!'),
      rawId: $('rawId', 'String!'),
      // response: $('response', 'AuthenticatorAssertionResponseDTO!'),
      response: {
        authenticatorData: $('authenticatorData', 'String!'),
        clientDataJSON: $('clientDataJSON', 'String!'),
        signature: $('signature', 'String!'),
        userHandle: $('userHandle', 'String'),
      },
      type: $('type', 'String!'),
    },
    true,
  ],
});

export const registerMutation = typedGql('mutation')({
  registerUser: [
    {
      id: $('id', 'String!'),
      rawId: $('rawId', 'String!'),
      // response: $('response', 'AuthenticatorAssertionResponseDTO!'),
      response: {
        attestationObject: $('attestationObject', 'String!'),
        authenticatorData: $('authenticatorData', 'String!'),
        clientDataJSON: $('clientDataJSON', 'String!'),
        transports: $('transports', '[String!]!'),
        publicKey: $('publicKey', 'String!'),
        publicKeyAlgorithm: $('publicKeyAlgorithm', 'Float!'),
      },
      type: $('type', 'String!'),
      user: $('user', 'String!'),
    },
    true,
  ],
});

// export const addPasskeyMutation = typedGql('mutation')({
//   addUserCredential: [
//     {
//       data: $('data', 'String!'),
//     }as any,
//     true,
//   ],
// });

export const logoutMutation = typedGql('mutation')({
  logoutUser: true,
});
