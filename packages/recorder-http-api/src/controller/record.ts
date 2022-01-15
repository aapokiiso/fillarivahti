import { container } from 'tsyringe';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { Logger } from 'winston';
import * as FillarivahtiHslCapacityProvider from '@aapokiiso/fillarivahti-hsl-capacity-provider';
import * as FillarivahtiCapacityRepository from '@aapokiiso/fillarivahti-capacity-repository';
import { middleware as basicAuthMiddleware } from '../middleware/basic-auth';

const capacityProvider = container.resolve<FillarivahtiHslCapacityProvider.CapacityProvider>('FillarivahtiHslCapacityProvider.CapacityProvider');
const capacityRepository = container.resolve<FillarivahtiCapacityRepository.CapacityRepository>('FillarivahtiCapacityRepository.CapacityRepository');
const logger = container.resolve<Logger>('FillarivahtiRecorderHttpApi.Logger');

// eslint-disable-next-line new-cap
const recordRouter = express.Router();

recordRouter.use(basicAuthMiddleware);

recordRouter.post('/', async (req, res) => {
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

export default recordRouter;
