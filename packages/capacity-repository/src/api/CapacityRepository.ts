import Capacity from './data/Capacity';

interface CapacityRepository
{
    create(capacity: Capacity): Promise<void>;
}

export default CapacityRepository;
