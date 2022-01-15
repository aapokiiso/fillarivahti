import { AxiosInstance } from 'axios';

export interface ConnectionProvider {
    getConnection(): AxiosInstance;
}
