import axios from 'axios';

declare module 'axios' {
    export interface AxiosRequestConfig {
        Email?: string,
        baseURL?: string,
    }
}

const api = axios.create({
    // baseURL: 'http://localhost:3333'
    // baseURL: 'http://192.168.100.7:3333'
    baseURL: 'http://ec2-34-230-47-115.compute-1.amazonaws.com:3333'
});

export default api;