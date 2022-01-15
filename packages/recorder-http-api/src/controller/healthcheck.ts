import { container } from 'tsyringe';
import * as FillarivahtiOrm from '@aapokiiso/fillarivahti-orm';
import { Logger } from 'winston';

const ormConnectionProvider = container.resolve<FillarivahtiOrm.ConnectionProvider>('FillarivahtiOrm.ConnectionProvider');
const logger = container.resolve<Logger>('FillarivahtiRecorderHttpApi.Logger');

import * as express from 'express';
import { StatusCodes } from 'http-status-codes';

// eslint-disable-next-line new-cap
const healthcheckRouter = express.Router();

healthcheckRouter.get('/', async (req, res) => {
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

export default healthcheckRouter;
