import 'reflect-metadata';
import { container } from 'tsyringe';

import * as FillarivahtiOrm from '@aapokiiso/fillarivahti-orm';
import * as FillarivahtiCapacityRepository from '@aapokiiso/fillarivahti-capacity-repository';

import { CapacityCacheControlApplier } from './interface/CapacityCacheControlApplier';
import { CapacityCacheLifetimeResolver } from './interface/CapacityCacheLifetimeResolver';
import { LatestCapacityTimestampResolver } from './interface/LatestCapacityTimestampResolver';
import { StationIdParser } from './interface/StationIdParser';
import { DefaultCapacityCacheControlApplier } from './service/DefaultCapacityCacheControlApplier';
import { DefaultCapacityCacheLifetimeResolver } from './service/DefaultCapacityCacheLifetimeResolver';
import { DefaultLatestCapacityTimestampResolver } from './service/DefaultLatestCapacityTimestampResolver';
import { DefaultStationIdParser } from './service/DefaultStationIdParser';
import { Logger } from 'winston';
import { jsonLogger } from './util/json-logger';

FillarivahtiOrm.diRegisterDefaults();
FillarivahtiCapacityRepository.diRegisterDefaults();

container.register<CapacityCacheControlApplier>('FillarivahtiHttpApi.CapacityCacheControlApplier', { useClass: DefaultCapacityCacheControlApplier });
container.register<CapacityCacheLifetimeResolver>('FillarivahtiHttpApi.CapacityCacheLifetimeResolver', { useClass: DefaultCapacityCacheLifetimeResolver });
container.register<LatestCapacityTimestampResolver>('FillarivahtiHttpApi.LatestCapacityTimestampResolver', { useClass: DefaultLatestCapacityTimestampResolver });
container.register<StationIdParser>('FillarivahtiHttpApi.StationIdParser', { useClass: DefaultStationIdParser });
container.register<Logger>('FillarivahtiHttpApi.Logger', { useValue: jsonLogger });
