import { singleton, inject } from 'tsyringe';
import { Sequelize } from 'sequelize';
import path from 'path';
import fs from 'fs';
import { ConnectionProvider } from '../interface/ConnectionProvider';
import { Configuration } from '../interface/Configuration';

@singleton()
export class MysqlConnectionProvider implements ConnectionProvider {
    private connection: Sequelize | null = null;

    constructor(
        @inject('FillarivahtiOrm.Configuration') private configuration: Configuration,
    ) { }

    async getConnection(): Promise<Sequelize> {
        if (this.connection === null) {
            this.connection = this.createConnection();
            this.importModels(this.connection);

            // TODO: Remove altering when migration deployments are automated.
            await this.connection.sync({ alter: true });
        }

        return this.connection;
    }

    private createConnection() {
        const database = this.configuration.getDatabase();
        if (!database) {
            throw new Error('Database name is missing in configuration.');
        }

        const username = this.configuration.getUsername();
        if (!username) {
            throw new Error('Username is missing in configuration.');
        }

        return new Sequelize(
            database,
            username,
            this.configuration.getPassword(),
            {
                host: this.configuration.getHost(),
                port: this.configuration.getPort(),
                dialect: 'mysql',
                // eslint-disable-next-line no-console
                logging: this.configuration.isLoggingEnabled() ? console.log : false,
                dialectOptions: {
                    socketPath: this.configuration.getSocketPath(),
                },
            },
        );
    }

    private importModels(connection: Sequelize) {
        const modelsDir = path.resolve(__dirname, '..', 'models');

        const fileNames = getFileNames(modelsDir);

        fileNames
            .filter(fileName => isJsFile(fileName))
            .forEach(importModel);

        function getFileNames(dir: string): string[] {
            return fs.readdirSync(dir);
        }

        function isJsFile(fileName: string): boolean {
            return fileName.endsWith('.js');
        }

        function importModel(fileName: string) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const model = require(path.join(modelsDir, fileName)).default;
            model(connection);
        }
    }
}
