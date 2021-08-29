import GraphqlCapacityProvider from './service/GraphqlCapacityProvider';
import { DefaultConnectionProvider, EnvConfiguration as GraphqlConfiguration } from '@aapokiiso/fillarivahti-hsl-graphql';
import { MysqlConnectionProvider, EnvConfiguration as OrmConfiguration } from '@aapokiiso/fillarivahti-orm';
import { OrmCapacityRepository } from '@aapokiiso/fillarivahti-capacity-repository';
import * as winston from 'winston';
import * as cron from 'node-cron';

const graphqlConfiguration = new GraphqlConfiguration();

const graphqlConnectionProvider = new DefaultConnectionProvider(
    graphqlConfiguration,
);

const capacityProvider = new GraphqlCapacityProvider(
    graphqlConnectionProvider,
);

const ormConfiguration = new OrmConfiguration();

const ormConnectionProvider = new MysqlConnectionProvider(
    ormConfiguration,
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
        const capacities = await capacityProvider.getCapacities();

        await Promise.all(capacities.map(capacity => capacityRepository.create(capacity)));

        logger.info('Fillarivahti recorder is completed.');
    } catch (error) {
        logger.error('Failed to record bike station capacities.', {
            error: error.message,
            stack: error.stack,
        });
    }
});
