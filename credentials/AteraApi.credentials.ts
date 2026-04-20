import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AteraApi implements ICredentialType {
	name = 'ateraApi';

	displayName = 'Atera API';

	icon: Icon = { light: 'file:../nodes/Atera/atera.svg', dark: 'file:../nodes/Atera/atera.dark.svg' };

	documentationUrl = 'https://app.atera.com/apidocs';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'API key from Atera Admin > Data management > API',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://app.atera.com',
			required: true,
			description: 'Base URL for Atera API',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-KEY': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api/v3/account',
			method: 'GET',
		},
	};
}
