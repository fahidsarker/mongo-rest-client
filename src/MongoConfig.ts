export class MongoConfig {
  readonly baseUrl: string;
  readonly dbName: string;
  readonly apiKey: string;
  readonly defaultFetchConfig?: RequestInit;
  readonly clusterName: string;

  constructor({
    baseUrl,
    dbName,
    apiKey,
    defaultFetchConfig,
    clusterName,
  }: {
    baseUrl: string;
    dbName: string;
    apiKey: string;
    defaultFetchConfig?: RequestInit;
    clusterName: string;
  }) {
    this.baseUrl = baseUrl;
    this.dbName = dbName;
    this.apiKey = apiKey;
    this.clusterName = clusterName;
    this.defaultFetchConfig = defaultFetchConfig;
  }
}
