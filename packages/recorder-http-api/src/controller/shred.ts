import { container } from 'tsyringe';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { Logger } from 'winston';
import * as FillarivahtiCapacityRepository from '@aapokiiso/fillarivahti-capacity-repository';
import { middleware as basicAuthMiddleware } from '../middleware/basic-auth';

const capacityShredder = container.resolve<FillarivahtiCapacityRepository.CapacityShredder>('FillarivahtiCapacityRepository.CapacityShredder');
const logger = container.resolve<Logger>('FillarivahtiRecorderHttpApi.Logger');

// eslint-disable-next-line new-cap
const shredRouter = express.Router();

shredRouter.use(basicAuthMiddleware);

shredRouter.post('/', async (req, res) => {
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

export default shredRouter;
