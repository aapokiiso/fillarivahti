import * as express from 'express';
import * as basicAuth from 'express-basic-auth';
import { container } from 'tsyringe';
import { Configuration } from '../interface/Configuration';

const configuration = container.resolve<Configuration>('FillarivahtiRecorderHttpApi.Configuration');

export const middleware = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    const username = configuration.getBasicAuthUsername();
    const password = configuration.getBasicAuthPassword();

    if (username && password) {
        basicAuth.default({
            users: {
                [username]: password,
            },
        })(req, res, next);
    } else {
        // eslint-disable-next-line callback-return
        next();
    }
};
