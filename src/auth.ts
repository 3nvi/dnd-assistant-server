import { AuthenticationClient, ManagementClient } from 'auth0';

const authClient = new AuthenticationClient({
  domain: process.env.AUTH0_DOMAIN as string,
  clientId: process.env.AUTH0_CLIENT_ID as string,
});

const managementClient = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN as string,
  token: '{YOUR_API_V2_TOKEN}',
});

export { authClient, managementClient };
