declare namespace NodeJS {
    interface ProcessEnv {
        readonly NODE_ENV: 'development' | 'production' | 'test';
        readonly API_PORT: string;
        //alation
        readonly ALATION_API_URL: string;
        readonly ALATION_USERNAME: string;
        readonly ALATION_PASSWORD: string;
        readonly ALATION_TOKEN_NAME: string;
    }
}
