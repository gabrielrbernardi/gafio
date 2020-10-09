import axios from 'axios';

declare module 'axios' {
    export interface AxiosRequestConfig {
      Email?: string,
      baseURL?: string,
    }
}

const api = axios.create({
    baseURL: 'http://localhost:3333'
});

export default api;