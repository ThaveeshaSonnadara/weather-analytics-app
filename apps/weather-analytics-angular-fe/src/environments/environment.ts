import { domain, clientId, Auth0Audiance } from '../../auth_config.json';

export const environment = {
  production: false,
  auth: {
    domain,
    clientId,
    audience: Auth0Audiance,
  },
  apiUrl: 'http://localhost:3000/api',
};
