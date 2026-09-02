import { domain, clientId, Auth0Audiance } from '../../auth_config.json';

export const environment = {
    production: true,
    auth: {
        domain,
        clientId,
        audience: Auth0Audiance,
    },
    apiUrl: 'https://production-api.com/api',
};