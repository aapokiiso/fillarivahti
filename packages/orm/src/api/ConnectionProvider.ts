import { Sequelize } from 'sequelize';

interface ConnectionProvider
{
    getConnection(): Promise<Sequelize>;
}

export default ConnectionProvider;
