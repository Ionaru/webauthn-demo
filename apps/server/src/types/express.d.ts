import { SessionDTO } from './dto.graphql';

declare module 'express-session' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface SessionData extends SessionDTO {}
}
