import 'reflect-metadata';
import { container } from 'tsyringe';

import * as FillarivahtiOrm from '@aapokiiso/fillarivahti-orm';

import { CapacityRepository } from './interface/CapacityRepository';
import { CapacityProvider } from './interface/CapacityProvider';
import { Configuration } from './interface/Configuration';
import { AggregateCapacityMapper } from './interface/AggregateCapacityMapper';
import { CapacityShredder } from './interface/CapacityShredder';

import { OrmCapacityRepository } from './service/OrmCapacityRepository';
import { OrmCapacityProvider } from './service/OrmCapacityProvider';
import { OrmCapacityShredder } from './service/OrmCapacityShredder';
import { EnvConfiguration } from './service/EnvConfiguration';
import { DefaultAggregateCapacityMapper } from './service/DefaultAggregateCapacityMapper';

export const registerDefaults = (): void => {
    FillarivahtiOrm.diRegisterDefaults();

    container.register<AggregateCapacityMapper>('FillarivahtiCapacityRepository.AggregateCapacityMapper', { useClass: DefaultAggregateCapacityMapper });
    container.register<Configuration>('FillarivahtiCapacityRepository.Configuration', { useClass: EnvConfiguration });
    container.register<CapacityProvider>('FillarivahtiCapacityRepository.CapacityProvider', { useClass: OrmCapacityProvider });
    container.register<CapacityRepository>('FillarivahtiCapacityRepository.CapacityRepository', { useClass: OrmCapacityRepository });
    container.register<CapacityShredder>('FillarivahtiCapacityRepository.CapacityShredder', { useClass: OrmCapacityShredder });
};
