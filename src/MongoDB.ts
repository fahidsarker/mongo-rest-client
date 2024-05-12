import { MongoCollection } from "./MongoCollection";
import { MongoConfig } from "./MongoConfig";

export class MongoDB<C extends {}> extends MongoConfig {
  readonly collections: C;

  private constructor(
    config: MongoConfig & { schemaBuilder: (db: MongoDB<any>) => C }
  ) {
    super(config);
    this.collections = config.schemaBuilder(this);
  }

  static connect = <C extends {}>(
    config: MongoConfig & { schemaBuilder: (db: MongoDB<any>) => C }
  ) => new MongoDB(config).collections;

  collection = <T>(collection: string) =>
    new MongoCollection<T>({ ...this, collection });
}
