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
      response: {
        authenticatorData: $('authenticatorData', 'String!'),
        clientDataJSON: $('clientDataJSON', 'String!'),
        signature: $('signature', 'String!'),
      },
    },
    true,
  ],
});

export const registerMutation = typedGql('mutation')({
  registerUser: [
    {
      id: $('id', 'String!'),
      response: {
        authenticatorData: $('authenticatorData', 'String!'),
        clientDataJSON: $('clientDataJSON', 'String!'),
        publicKey: $('publicKey', 'String!'),
        publicKeyAlgorithm: $('publicKeyAlgorithm', 'Float!'),
      },
      user: {
        name: $('userName', 'String!'),
      },
    },
    true,
  ],
});

export const addPasskeyMutation = typedGql('mutation')({
  addUserCredential: [
    {
      id: $('id', 'String!'),
      response: {
        authenticatorData: $('authenticatorData', 'String!'),
        clientDataJSON: $('clientDataJSON', 'String!'),
        publicKey: $('publicKey', 'String!'),
        publicKeyAlgorithm: $('publicKeyAlgorithm', 'Float!'),
      },
      user: {
        name: $('userName', 'String!'),
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
