import { Capacity } from './interface/data/Capacity';
import { AggregateCapacity } from './interface/data/AggregateCapacity';
import { CapacityRepository } from './interface/CapacityRepository';
import { CapacityProvider } from './interface/CapacityProvider';
import { Configuration } from './interface/Configuration';
import { AggregateCapacityMapper } from './interface/AggregateCapacityMapper';
import { CapacityShredder } from './interface/CapacityShredder';

export {
    Capacity,
    AggregateCapacity,
    CapacityRepository,
    CapacityProvider,
    Configuration,
    AggregateCapacityMapper,
    CapacityShredder,
};

import { OrmCapacityRepository } from './service/OrmCapacityRepository';
import { OrmCapacityProvider } from './service/OrmCapacityProvider';
import { OrmCapacityShredder } from './service/OrmCapacityShredder';
import { EnvConfiguration } from './service/EnvConfiguration';
import { DefaultAggregateCapacityMapper } from './service/DefaultAggregateCapacityMapper';

export {
    OrmCapacityRepository,
    OrmCapacityProvider,
    OrmCapacityShredder,
    EnvConfiguration,
    DefaultAggregateCapacityMapper,
};

export { registerDefaults as diRegisterDefaults } from './di';
