import 'reflect-metadata';
import { container } from 'tsyringe';

import { Configuration } from './interface/Configuration';
import { ConnectionProvider } from './interface/ConnectionProvider';
import { EnvConfiguration } from './service/EnvConfiguration';
import { DefaultConnectionProvider } from './service/DefaultConnectionProvider';

export const registerDefaults = (): void => {
    container.register<Configuration>('FillarivahtiHslGraphqlClient.Configuration', { useClass: EnvConfiguration });
    container.register<ConnectionProvider>('FillarivahtiHslGraphqlClient.ConnectionProvider', { useClass: DefaultConnectionProvider });
};
