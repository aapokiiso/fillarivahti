import { Sequelize } from 'sequelize';
import ConnectionProvider from '../api/ConnectionProvider';
import path from 'path';
import fs from 'fs';

export default class MysqlConnectionProvider implements ConnectionProvider {
    dbName: string;
    dbUser: string;
    dbPassword: string|undefined;
    dbHost: string|undefined;
    dbPort: number|undefined;
    dbSocketPath: string|undefined;
    dbLogging: boolean;

    connection: Sequelize|null = null;

    constructor(
        dbName: string,
        dbUser: string,
        dbPassword: string|undefined,
        dbHost: string|undefined,
        dbPort: number|undefined,
        dbSocketPath: string|undefined,
        dbLogging: boolean,
    ) {
        this.dbName = dbName;
        this.dbUser = dbUser;
        this.dbPassword = dbPassword;
        this.dbHost = dbHost;
        this.dbPort = dbPort;
        this.dbSocketPath = dbSocketPath;
        this.dbLogging = dbLogging;
    }

    async getConnection(): Promise<Sequelize> {
        if (this.connection === null) {
            this.connection = this.createConnection();
            this.importModels(this.connection);
            await this.connection.sync();
        }

        return this.connection;
    }

    private createConnection() {
        return new Sequelize(
            this.dbName,
            this.dbUser,
            this.dbPassword,
            {
                host: this.dbHost,
                port: this.dbPort,
                dialect: 'mysql',
                // eslint-disable-next-line no-console
                logging: this.dbLogging ? console.log : false,
                dialectOptions: {
                    socketPath: this.dbSocketPath,
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
