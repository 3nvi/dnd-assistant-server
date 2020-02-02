import { AuthenticationClient } from 'auth0';

const authClient = new AuthenticationClient({
  domain: process.env.AUTH0_DOMAIN as string,
  clientId: process.env.AUTH0_CLIENT_ID as string,
});

export { authClient };
