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
      response: {
        attestationObject: $('attestationObject', 'String!'),
        authenticatorData: $('authenticatorData', 'String!'),
        clientDataJSON: $('clientDataJSON', 'String!'),
        transports: $('transports', '[String!]!'),
        publicKey: $('publicKey', 'String!'),
        publicKeyAlgorithm: $('publicKeyAlgorithm', 'Float!'),
      },
      type: $('type', 'String!'),
      user: {
        id: $('userId', 'String!'),
        name: $('userName', 'String!'),
        displayName: $('userDisplayName', 'String'),
      },
    },
    true,
  ],
});

export const addPasskeyMutation = typedGql('mutation')({
  addUserCredential: [
    {
      id: $('id', 'String!'),
      rawId: $('rawId', 'String!'),
      response: {
        attestationObject: $('attestationObject', 'String!'),
        authenticatorData: $('authenticatorData', 'String!'),
        clientDataJSON: $('clientDataJSON', 'String!'),
        transports: $('transports', '[String!]!'),
        publicKey: $('publicKey', 'String!'),
        publicKeyAlgorithm: $('publicKeyAlgorithm', 'Float!'),
      },
      type: $('type', 'String!'),
      user: {
        id: $('userId', 'String!'),
        name: $('userName', 'String!'),
        displayName: $('userDisplayName', 'String'),
      },
    },
    true,
  ],
});

export const logoutMutation = typedGql('mutation')({
  logoutUser: true,
});

export const secretQuery = typedGql('query')({
  secret: true,
});
