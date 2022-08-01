import 'reflect-metadata';
import { container } from 'tsyringe';

import * as FillarivahtiCapacityRepository from '@aapokiiso/fillarivahti-capacity-repository';

import { AvailabilityEstimation } from './interface/AvailabilityEstimation';

import { LinearRegressionAvailabilityEstimation } from './service/LinearRegressionAvailabilityEstimation';

export const registerDefaults = (): void => {
    FillarivahtiCapacityRepository.diRegisterDefaults();

    container.register<AvailabilityEstimation>('FillarivahtiAvailabilityEstimation.AvailabilityEstimation', { useClass: LinearRegressionAvailabilityEstimation });
};
