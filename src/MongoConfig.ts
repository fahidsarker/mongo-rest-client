export class MongoConfig {
  readonly baseUrl: string;
  readonly dbName: string;
  readonly apiKey: string;

  constructor({
    baseUrl,
    dbName,
    apiKey,
  }: {
    baseUrl: string;
    dbName: string;
    apiKey: string;
  }) {
    this.baseUrl = baseUrl;
    this.dbName = dbName;
    this.apiKey = apiKey;
  }
}
