import 'reflect-metadata';
import { container } from 'tsyringe';

import * as FillarivahtiOrm from '@aapokiiso/fillarivahti-orm';
import * as FillarivahtiCapacityRepository from '@aapokiiso/fillarivahti-capacity-repository';
import * as FillarivahtiAvailabilityEstimation from '@aapokiiso/fillarivahti-availability-estimation';

import { CapacityCacheLifetimeResolver } from './interface/CapacityCacheLifetimeResolver';
import { CapacityCacheHydration } from './interface/CapacityCacheHydration';
import { StationIdParser } from './interface/StationIdParser';
import { RedisConfiguration } from './interface/RedisConfiguration';
import { RedisClientProvider } from './interface/RedisClientProvider';
import { DefaultCapacityCacheLifetimeResolver } from './service/DefaultCapacityCacheLifetimeResolver';
import { DefaultCapacityCacheHydration } from './service/DefaultCapacityCacheHydration';
import { DefaultStationIdParser } from './service/DefaultStationIdParser';
import { RedisEnvConfiguration } from './service/RedisEnvConfiguration';
import { DefaultRedisClientProvider } from './service/DefaultRedisClientProvider';
import { CacheAwareCapacityProvider } from './service/CacheAwareCapacityProvider';
import { Logger } from 'winston';
import { jsonLogger } from './util/json-logger';

FillarivahtiOrm.diRegisterDefaults();
FillarivahtiCapacityRepository.diRegisterDefaults();
FillarivahtiAvailabilityEstimation.diRegisterDefaults();

container.register<CapacityCacheLifetimeResolver>('FillarivahtiHttpApi.CapacityCacheLifetimeResolver', { useClass: DefaultCapacityCacheLifetimeResolver });
container.register<CapacityCacheHydration>('FillarivahtiHttpApi.CapacityCacheHydration', { useClass: DefaultCapacityCacheHydration });
container.register<StationIdParser>('FillarivahtiHttpApi.StationIdParser', { useClass: DefaultStationIdParser });
container.register<RedisConfiguration>('FillarivahtiHttpApi.RedisConfiguration', { useClass: RedisEnvConfiguration });
container.register<RedisClientProvider>('FillarivahtiHttpApi.RedisClientProvider', { useClass: DefaultRedisClientProvider });
container.register<FillarivahtiCapacityRepository.CapacityProvider>('FillarivahtiHttpApi.CacheAwareCapacityProvider', { useClass: CacheAwareCapacityProvider });
container.register<Logger>('FillarivahtiHttpApi.Logger', { useValue: jsonLogger });
