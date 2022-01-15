import express from 'express';
import healthcheckRouter from './controller/healthcheck';
import recordRouter from './controller/record';
import shredRouter from './controller/shred';
import cors from 'cors';

const app = express();

app.use(cors());

app.use('/', healthcheckRouter);
app.use('/record', recordRouter);
app.use('/shred', shredRouter);

export default app;
