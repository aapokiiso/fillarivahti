import 'reflect-metadata';
import { container } from 'tsyringe';

import { ConnectionProvider } from './interface/ConnectionProvider';
import { Configuration } from './interface/Configuration';
import { MysqlConnectionProvider } from './service/MysqlConnectionProvider';
import { EnvConfiguration } from './service/EnvConfiguration';

export const registerDefaults = (): void => {
    container.register<Configuration>('FillarivahtiOrm.Configuration', { useClass: EnvConfiguration });
    container.register<ConnectionProvider>('FillarivahtiOrm.ConnectionProvider', { useClass: MysqlConnectionProvider });
};
