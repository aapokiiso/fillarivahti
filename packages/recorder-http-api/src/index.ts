import express from 'express';
import { GraphqlCapacityProvider } from '@aapokiiso/fillarivahti-hsl-capacity-provider';
import { DefaultConnectionProvider, EnvConfiguration as GraphqlConfiguration } from '@aapokiiso/fillarivahti-hsl-graphql-client';
import { MysqlConnectionProvider, EnvConfiguration as OrmConfiguration } from '@aapokiiso/fillarivahti-orm';
import { OrmCapacityRepository } from '@aapokiiso/fillarivahti-capacity-repository';
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

app.get('/record', async (req, res) => {
    logger.info('Fillarivahti recorder is run.');

    try {
        const capacities = await capacityProvider.getCapacities();

        await capacityRepository.createMany(capacities);

        logger.info('Fillarivahti recorder is completed.');

        return res.status(StatusCodes.OK).end();
    } catch (error: any) {
        logger.error('Failed to record bike station capacities.', {
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
