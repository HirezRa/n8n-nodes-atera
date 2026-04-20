import { NodeConnectionTypes, type INodeProperties, type INodeType, type INodeTypeDescription } from 'n8n-workflow';

const withResource = (resource: string) => ({ resource: [resource] });
const withResourceOperation = (resource: string, operation: string) => ({
	resource: [resource],
	operation: [operation],
});

const paginationFields = (resource: string): INodeProperties[] => [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: withResourceOperation(resource, 'getAll'),
		},
		routing: {
			send: {
				paginate: '={{ $value }}',
				type: 'query',
				property: 'itemsInPage',
				value: '500',
			},
			request: {
				qs: {
					page: 1,
				},
			},
			operations: {
				pagination: {
					type: 'generic',
					properties: {
						continue: '={{ !!$response.body?.nextLink }}',
						request: {
							url: '={{ $response.body?.nextLink || $request.url }}',
						},
					},
				},
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				...withResourceOperation(resource, 'getAll'),
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 500,
		},
		routing: {
			send: {
				type: 'query',
				property: 'itemsInPage',
			},
			output: {
				maxResults: '={{$value}}',
			},
		},
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		description: 'Page index to fetch',
		displayOptions: {
			show: {
				...withResourceOperation(resource, 'getAll'),
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		routing: {
			send: {
				type: 'query',
				property: 'page',
			},
		},
	},
];

export class Atera implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Atera',
		name: 'atera',
		icon: { light: 'file:atera.svg', dark: 'file:atera.dark.svg' },
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Atera API v3',
		defaults: {
			name: 'Atera',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'ateraApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Account', value: 'account' },
					{ name: 'Agent', value: 'agent' },
					{ name: 'Alert', value: 'alert' },
					{ name: 'Customer', value: 'customer' },
					{ name: 'Ticket', value: 'ticket' },
				],
				default: 'account',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: withResource('account') },
				options: [
					{
						name: 'Get',
						value: 'get',
						action: 'Get account information',
						routing: {
							request: {
								method: 'GET',
								url: '/api/v3/account',
							},
						},
					},
				],
				default: 'get',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: withResource('agent') },
				options: [
					{
						name: 'Delete',
						value: 'delete',
						action: 'Delete an agent',
						routing: {
							request: {
								method: 'DELETE',
								url: '=/api/v3/agents/{{$parameter.agentId}}',
							},
						},
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get an agent',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/v3/agents/{{$parameter.agentId}}',
							},
						},
					},
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'Get many agents',
						routing: {
							request: {
								method: 'GET',
								url: '/api/v3/agents',
							},
							output: {
								postReceive: [
									{
										type: 'rootProperty',
										properties: {
											property: 'items',
										},
									},
								],
							},
						},
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Agent ID',
				name: 'agentId',
				type: 'number',
				required: true,
				default: 0,
				displayOptions: {
					show: {
						...withResource('agent'),
						operation: ['get', 'delete'],
					},
				},
				description: 'System agent ID',
			},
			...paginationFields('agent'),
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: withResource('alert') },
				options: [
					{
						name: 'Create',
						value: 'create',
						action: 'Create an alert',
						routing: {
							request: {
								method: 'POST',
								url: '/api/v3/alerts',
								body: '={{$parameter.payload}}',
							},
						},
					},
					{
						name: 'Delete',
						value: 'delete',
						action: 'Delete an alert',
						routing: {
							request: {
								method: 'DELETE',
								url: '=/api/v3/alerts/{{$parameter.alertId}}',
							},
						},
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get an alert',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/v3/alerts/{{$parameter.alertId}}',
							},
						},
					},
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'Get many alerts',
						routing: {
							request: {
								method: 'GET',
								url: '/api/v3/alerts',
							},
							output: {
								postReceive: [
									{
										type: 'rootProperty',
										properties: {
											property: 'items',
										},
									},
								],
							},
						},
					},
					{
						name: 'Update',
						value: 'update',
						action: 'Update an alert',
						routing: {
							request: {
								method: 'PUT',
								url: '=/api/v3/alerts/{{$parameter.alertId}}',
								body: '={{$parameter.payload}}',
							},
						},
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Alert ID',
				name: 'alertId',
				type: 'number',
				required: true,
				default: 0,
				displayOptions: {
					show: {
						...withResource('alert'),
						operation: ['get', 'update', 'delete'],
					},
				},
			},
			...paginationFields('alert'),
			{
				displayName: 'Payload',
				name: 'payload',
				type: 'json',
				required: true,
				default: '{}',
				displayOptions: {
					show: {
						...withResource('alert'),
						operation: ['create', 'update'],
					},
				},
				description: 'Alert request body as JSON based on Atera API documentation',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: withResource('customer') },
				options: [
					{
						name: 'Create',
						value: 'create',
						action: 'Create a customer',
						routing: {
							request: {
								method: 'POST',
								url: '/api/v3/customers',
								body: '={{$parameter.payload}}',
							},
						},
					},
					{
						name: 'Delete',
						value: 'delete',
						action: 'Delete a customer',
						routing: {
							request: {
								method: 'DELETE',
								url: '=/api/v3/customers/{{$parameter.customerId}}',
							},
						},
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get a customer',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/v3/customers/{{$parameter.customerId}}',
							},
						},
					},
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'Get many customers',
						routing: {
							request: {
								method: 'GET',
								url: '/api/v3/customers',
							},
							output: {
								postReceive: [
									{
										type: 'rootProperty',
										properties: {
											property: 'items',
										},
									},
								],
							},
						},
					},
					{
						name: 'Update',
						value: 'update',
						action: 'Update a customer',
						routing: {
							request: {
								method: 'PUT',
								url: '=/api/v3/customers/{{$parameter.customerId}}',
								body: '={{$parameter.payload}}',
							},
						},
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Customer ID',
				name: 'customerId',
				type: 'number',
				required: true,
				default: 0,
				displayOptions: {
					show: {
						...withResource('customer'),
						operation: ['get', 'update', 'delete'],
					},
				},
			},
			...paginationFields('customer'),
			{
				displayName: 'Payload',
				name: 'payload',
				type: 'json',
				required: true,
				default: '{}',
				displayOptions: {
					show: {
						...withResource('customer'),
						operation: ['create', 'update'],
					},
				},
				description: 'Customer request body as JSON based on Atera API documentation',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: withResource('ticket') },
				options: [
					{
						name: 'Create',
						value: 'create',
						action: 'Create a ticket',
						routing: {
							request: {
								method: 'POST',
								url: '/api/v3/tickets',
								body: '={{$parameter.payload}}',
							},
						},
					},
					{
						name: 'Delete',
						value: 'delete',
						action: 'Delete a ticket',
						routing: {
							request: {
								method: 'DELETE',
								url: '=/api/v3/tickets/{{$parameter.ticketId}}',
							},
						},
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get a ticket',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/v3/tickets/{{$parameter.ticketId}}',
							},
						},
					},
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'Get many tickets',
						routing: {
							request: {
								method: 'GET',
								url: '/api/v3/tickets',
							},
							output: {
								postReceive: [
									{
										type: 'rootProperty',
										properties: {
											property: 'items',
										},
									},
								],
							},
						},
					},
					{
						name: 'Update',
						value: 'update',
						action: 'Update a ticket',
						routing: {
							request: {
								method: 'PUT',
								url: '=/api/v3/tickets/{{$parameter.ticketId}}',
								body: '={{$parameter.payload}}',
							},
						},
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Ticket ID',
				name: 'ticketId',
				type: 'number',
				required: true,
				default: 0,
				displayOptions: {
					show: {
						...withResource('ticket'),
						operation: ['get', 'update', 'delete'],
					},
				},
			},
			...paginationFields('ticket'),
			{
				displayName: 'Payload',
				name: 'payload',
				type: 'json',
				required: true,
				default: '{}',
				displayOptions: {
					show: {
						...withResource('ticket'),
						operation: ['create', 'update'],
					},
				},
				description: 'Ticket request body as JSON based on Atera API documentation',
			},
		],
	};
}
