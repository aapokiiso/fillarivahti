import 'reflect-metadata';
import { container } from 'tsyringe';

import * as FillarivahtiCapacityRepository from '@aapokiiso/fillarivahti-capacity-repository';
import * as FillarivahtiHslGraphqlClient from '@aapokiiso/fillarivahti-hsl-graphql-client';

import { CapacityProvider } from './interface/CapacityProvider';
import { GraphqlCapacityProvider } from './service/GraphqlCapacityProvider';

export const registerDefaults = (): void => {
    FillarivahtiCapacityRepository.diRegisterDefaults();
    FillarivahtiHslGraphqlClient.diRegisterDefaults();

    container.register<CapacityProvider>('FillarivahtiHslCapacityProvider.CapacityProvider', { useClass: GraphqlCapacityProvider });
};
