import { AxiosInstance } from 'axios';

interface GraphqlConnectionProvider
{
    getConnection(): AxiosInstance;
}

export default GraphqlConnectionProvider;
