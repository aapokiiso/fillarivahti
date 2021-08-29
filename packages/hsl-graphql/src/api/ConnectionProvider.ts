import { AxiosInstance } from 'axios';

interface ConnectionProvider
{
    getConnection(): AxiosInstance;
}

export default ConnectionProvider;
