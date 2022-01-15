import './di';
import app from './app';
import { container } from 'tsyringe';
import { Logger } from 'winston';

const logger = container.resolve<Logger>('FillarivahtiRecorderHttpApi.Logger');

const port = process.env.PORT ? Number(process.env.PORT) : null;
if (port) {
    app.listen(port, () => {
        logger.info(`Started Fillarivahti recorder HTTP API on port ${port}.`);
    });
} else {
    logger.error('PORT environment variable is missing.');
}
