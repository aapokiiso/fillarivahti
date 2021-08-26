import GraphqlCapacityProvider from './service/GraphqlCapacityProvider';
import DefaultGraphqlConnectionProvider from './service/DefaultGraphqlConnectionProvider';
import { MysqlConnectionProvider } from '@aapokiiso/fillarivahti-orm';
import { OrmCapacityRepository } from '@aapokiiso/fillarivahti-capacity-repository';
import * as winston from 'winston';
import * as cron from 'node-cron';

if (!process.env.GRAPHQL_ENDPOINT) {
    throw new Error('HSL Routing API GraphQL endpoint URL is missing.');
}

const graphqlConnectionProvider = new DefaultGraphqlConnectionProvider(
    process.env.GRAPHQL_ENDPOINT,
);

const capacityProvider = new GraphqlCapacityProvider(
    graphqlConnectionProvider,
);

if (!process.env.DB_NAME) {
    throw new Error('Database name is missing.');
}

if (!process.env.DB_USER) {
    throw new Error('Database user is missing.');
}

const ormConnectionProvider = new MysqlConnectionProvider(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    process.env.DB_HOST,
    typeof process.env.DB_PORT !== 'undefined' ? Number(process.env.DB_PORT) : undefined,
    process.env.DB_SOCKET_PATH,
    process.env.DB_LOGGING === '1',
);

const capacityRepository = new OrmCapacityRepository(
    ormConnectionProvider,
);

const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
    ],
});

logger.info('Starting Fillarivahti recorder.');

cron.schedule('*/5 * * * *', async function () {
    logger.info('Fillarivahti recorder is run.');

    try {
        const capacities = await capacityProvider.getCapacities(['062', '162']);

        await Promise.all(capacities.map(capacity => capacityRepository.create(capacity)));

        logger.info('Fillarivahti recorder is completed.');
    } catch (error) {
        logger.error('Failed to record bike station capacities.', {
            error: error.message,
            stack: error.stack,
        });
    }
});
