import GraphqlCapacityProvider from './service/GraphqlCapacityProvider';
import DefaultGraphqlConnectionProvider from './service/DefaultGraphqlConnectionProvider';
import { DefaultConnectionProvider as DefaultOrmConnectionProvider } from '@aapokiiso/fillarivahti-orm';
import { OrmCapacityRepository } from '@aapokiiso/fillarivahti-capacity-repository';
import * as winston from 'winston';

import * as cron from 'node-cron';

const graphqlConnectionProvider = new DefaultGraphqlConnectionProvider(
    process.env.GRAPHQL_ENDPOINT,
);

const graphqlCapacityProvider = new GraphqlCapacityProvider(
    graphqlConnectionProvider,
);

const ormConnectionProvider = new DefaultOrmConnectionProvider(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    process.env.DB_HOST,
    typeof process.env.DB_PORT !== 'undefined' ? Number(process.env.DB_PORT) : undefined,
    process.env.DB_SOCKET_PATH,
    process.env.DB_LOGGING === '1',
);

const ormCapacityRepository = new OrmCapacityRepository(
    ormConnectionProvider,
);

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`),
    ),
    transports: [
        new winston.transports.Console(),
    ],
});

logger.info('Starting Fillarivahti recorder');

cron.schedule('*/5 * * * *', async function () {
    logger.info('Fillarivahti recorder is run');

    try {
        const capacities = await graphqlCapacityProvider.getCapacities(['062', '162']);

        await Promise.all(capacities.map(capacity => ormCapacityRepository.create(capacity)));

        logger.info('Fillarivahti recorder is completed');
    } catch (error) {
        logger.error('Failed to record bike station capacities. Reason:', error);
    }
});
