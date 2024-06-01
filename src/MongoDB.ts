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
  ) => {
    const db = new MongoDB(config);
    return {
      ...db.collections,
      collection: db.collection,
    };
  };

  collection = <T = any>(collection: string) =>
    new MongoCollection<T>({ ...this, collection });
}
