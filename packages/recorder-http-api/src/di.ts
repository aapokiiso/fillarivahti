import 'reflect-metadata';
import { container } from 'tsyringe';

import * as FillarivahtiOrm from '@aapokiiso/fillarivahti-orm';
import * as FillarivahtiCapacityRepository from '@aapokiiso/fillarivahti-capacity-repository';
import * as FillarivahtiHslCapacityProvider from '@aapokiiso/fillarivahti-hsl-capacity-provider';

import { Logger } from 'winston';
import { jsonLogger } from './util/json-logger';

FillarivahtiOrm.diRegisterDefaults();
FillarivahtiCapacityRepository.diRegisterDefaults();
FillarivahtiHslCapacityProvider.diRegisterDefaults();

container.register<Logger>('FillarivahtiRecorderHttpApi.Logger', { useValue: jsonLogger });
