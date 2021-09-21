import express from 'express';
import { GraphqlCapacityProvider } from '@aapokiiso/fillarivahti-hsl-capacity-provider';
import { DefaultConnectionProvider, EnvConfiguration as GraphqlConfiguration } from '@aapokiiso/fillarivahti-hsl-graphql-client';
import { MysqlConnectionProvider, EnvConfiguration as OrmConfiguration } from '@aapokiiso/fillarivahti-orm';
import { OrmCapacityRepository, OrmCapacityShredder, EnvConfiguration as CapacityRepositoryConfiguration } from '@aapokiiso/fillarivahti-capacity-repository';
import { StatusCodes } from 'http-status-codes';
import * as winston from 'winston';
import cors from 'cors';

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

const capacityRepositoryConfiguration = new CapacityRepositoryConfiguration();

const capacityShredder = new OrmCapacityShredder(
    ormConnectionProvider,
    capacityRepositoryConfiguration,
);

const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
    ],
});

const app = express();

app.use(cors());

app.get('/', async (req, res) => {
    try {
        const conn = await ormConnectionProvider.getConnection();
        await conn.authenticate();

        return res.status(StatusCodes.OK).end();
    } catch (error: any) {
        logger.error('Failed to connect to the database in the healthcheck endpoint.', {
            error: error.message,
            stack: error.stack,
        });

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});

app.post('/record', async (req, res) => {
    logger.info('Fillarivahti recorder recording is run.');

    try {
        const capacities = await capacityProvider.getCapacities();

        await capacityRepository.createMany(capacities);

        logger.info('Fillarivahti recorder recording is completed.');

        return res.status(StatusCodes.OK).end();
    } catch (error: any) {
        logger.error('Failed to record bike station capacities.', {
            error: error.message,
            stack: error.stack,
        });

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});

app.post('/shred', async (req, res) => {
    logger.info('Fillarivahti recorder shredding is run.');

    // TODO: move to configuration
    // Capacity records are retained for 5 full weeks (5 * 7 = 35), ie. the
    // current week and 4 weeks prior.
    const olderThanDays = 35;

    try {
        await capacityShredder.shredByAge(olderThanDays);

        logger.info('Fillarivahti recorder shredding is completed.');

        return res.status(StatusCodes.OK).end();
    } catch (error: any) {
        logger.error('Failed to shred old bike station capacities.', {
            error: error.message,
            stack: error.stack,
        });

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});

const port = process.env.PORT ? Number(process.env.PORT) : null;
if (port) {
    app.listen(port, () => {
        logger.info(`Started Fillarivahti recorder HTTP API on port ${port}.`);
    });
} else {
    logger.error('PORT environment variable is missing.');
}
