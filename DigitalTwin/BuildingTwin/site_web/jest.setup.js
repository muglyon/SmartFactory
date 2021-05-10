const configure = require('enzyme').configure;
const ReactSixteenAdapter = require('enzyme-adapter-react-16');

configure({ adapter: new ReactSixteenAdapter() });
jest.mock('@azure/event-hubs');
jest.mock('azure-iothub');
jest.mock('next');

const next = require("next");
// const EventHub = require('@azure/event-hubs');
const AzureIoTHubClient = require("azure-iothub").Client;
const RegistryIoTHubClient = require("azure-iothub").Registry;
// const EventHubClientMock = require('./__tests__/__mocks__/EventHubClientMock').default;
const AzureIoTHubMock = require('./__tests__/__mocks__/AzureIoTHubMock').default;
const RegistryIoTHubMock = require('./__tests__/__mocks__/RegistryIoTHubClientMock').default;
const NextMock = require('./__tests__/__mocks__/NextMock').default;

(next.default).mockReturnValue(new NextMock());
// EventHub.EventHubConsumerClient = jest.fn()
(AzureIoTHubClient.fromConnectionString).mockReturnValue(new AzureIoTHubMock());
(RegistryIoTHubClient.fromConnectionString).mockReturnValue(new RegistryIoTHubMock());

 process.env.KEYVAULT_NAME = "keyVaultName"
 process.env.TENANT_ID = "tenantId"
 process.env.CLIENT_ID = "clientId"
 process.env.CLIENT_SECRET = "clientSecret"