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
      data: $('data', 'String!'),
    },
    true,
  ],
});

export const registerMutation = typedGql('mutation')({
  registerUser: [
    {
      data: $('data', 'String!'),
    },
    true,
  ],
});

export const addPasskeyMutation = typedGql('mutation')({
  addPasskey: [
    {
      data: $('data', 'String!'),
    },
    true,
  ],
});

export const logoutMutation = typedGql('mutation')({
  logoutUser: true,
});
