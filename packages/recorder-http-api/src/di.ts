import 'reflect-metadata';
import { container } from 'tsyringe';

import * as FillarivahtiOrm from '@aapokiiso/fillarivahti-orm';
import * as FillarivahtiCapacityRepository from '@aapokiiso/fillarivahti-capacity-repository';
import * as FillarivahtiHslCapacityProvider from '@aapokiiso/fillarivahti-hsl-capacity-provider';

import { Logger } from 'winston';
import { jsonLogger } from './util/json-logger';
import { Configuration } from './interface/Configuration';
import { EnvConfiguration } from './service/EnvConfiguration';

FillarivahtiOrm.diRegisterDefaults();
FillarivahtiCapacityRepository.diRegisterDefaults();
FillarivahtiHslCapacityProvider.diRegisterDefaults();

container.register<Configuration>('FillarivahtiRecorderHttpApi.Configuration', { useClass: EnvConfiguration });
container.register<Logger>('FillarivahtiRecorderHttpApi.Logger', { useValue: jsonLogger });
