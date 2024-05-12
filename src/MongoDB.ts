import { MongoCollection } from "./MongoCollection";
import { MongoConfig } from "./MongoConfig";

export class MongoDB<C extends {}> extends MongoConfig {
  readonly collections: C;

  constructor(
    config: MongoConfig & { collectionBuilder: (db: MongoDB<any>) => C }
  ) {
    super(config);
    this.collections = config.collectionBuilder(this);
  }

  static connect = <C extends {}>(
    config: MongoConfig & { collectionBuilder: (db: MongoDB<any>) => C }
  ) => new MongoDB(config).collections;

  collection = <T>(collection: string) =>
    new MongoCollection<T>({ ...this, collection });
}
