import axios, {AxiosInstance} from 'axios';

let httpApiClient: AxiosInstance = undefined as any as AxiosInstance;

if (!httpApiClient) {
  httpApiClient = axios.create({baseURL: process.env.REACT_APP_API_URL});
}

export {
  httpApiClient,
};
