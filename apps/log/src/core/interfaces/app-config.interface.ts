export interface AppConfig {
  mongodbUri: string;
  rabbitmq: {
    url: string;
  };
}
