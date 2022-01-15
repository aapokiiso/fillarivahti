import { Sequelize } from 'sequelize';

export interface ConnectionProvider {
    getConnection(): Promise<Sequelize>;
}
