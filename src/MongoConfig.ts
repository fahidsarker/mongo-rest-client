export class MongoConfig {
  readonly baseUrl: string;
  readonly dbName: string;
  readonly apiKey: string;
  readonly defaultFetchConfig?: RequestInit;

  constructor({
    baseUrl,
    dbName,
    apiKey,
    defaultFetchConfig,
  }: {
    baseUrl: string;
    dbName: string;
    apiKey: string;
    defaultFetchConfig?: RequestInit;
  }) {
    this.baseUrl = baseUrl;
    this.dbName = dbName;
    this.apiKey = apiKey;
    this.defaultFetchConfig = defaultFetchConfig;
  }
}
