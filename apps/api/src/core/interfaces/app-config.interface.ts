export interface AppConfig  {
    port: number;
    databaseUrl: string;
    apiPrefix: string;
    baseUrl: string;
    accessToken: {
        secret: string;
        expiresIn: number;
    },
    refreshToken: {
        secret: string;
        expiresIn: number;
        saltRounds: number;
    },
    password: {
        saltRounds: number;
    },
    redis: {
        host: string;
        port: number;
    },
    userSession: {
        prefix: string;
        ttl: number;
    },
    aws: {
        region: string;
        verifiedEmail: string;
    },
    rabbitmq: {
        url: string;
    },
    cors: {
        origin: string;
    },
}
