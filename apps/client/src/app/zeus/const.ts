/* eslint-disable */

export const AllTypesProps: Record<string, any> = {
  Mutation: {
    addPasskey: {},
    loginUser: {},
    registerUser: {},
  },
};

export const ReturnTypes: Record<string, any> = {
  Mutation: {
    addPasskey: 'Boolean',
    createChallenge: 'String',
    loginUser: 'Boolean',
    logoutUser: 'Boolean',
    registerUser: 'Boolean',
  },
  Query: {
    session: 'SessionDTO',
  },
  SessionDTO: {
    user: 'String',
  },
};

export const Ops = {
  query: 'Query' as const,
  mutation: 'Mutation' as const,
};
