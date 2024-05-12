import { MongoConfig } from "./MongoConfig";
import { FilterOF } from "./models/FilterOf";
import { UpdateOf } from "./models/UpdateOf";
import { WithId } from "./models/WithId";

export class MongoCollection<T> extends MongoConfig {
  protected readonly collection: string;

  constructor(config: MongoConfig & { collection: string }) {
    super(config);
    this.collection = config.collection;
  }

  protected connect = async (
    action: "findOne" | "insertOne" | "find" | "updateOne" | "insertMany",
    body: Record<string, any>
  ) => {
    const res = await fetch(this.baseUrl + "/action/" + action, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": this.apiKey,
      },
      body: JSON.stringify({
        dataSource: "Cluster0",
        collection: this.collection,
        database: this.dbName,
        ...body,
      }),
    });

    return res.json();
  };

  insertOne = async <R extends T>(data: R): Promise<WithId<R>> => {
    const res = await this.connect("insertOne", {
      document: data,
    });

    const insertedId = res.insertedId;

    return { ...data, _id: insertedId };
  };

  insertMany = async <R extends T>(data: R[]): Promise<WithId<R>[]> => {
    const res = await this.connect("insertMany", {
      documents: data,
    });

    const insertedIds = res.insertedIds;

    return data.map((doc, i) => {
      return { ...doc, _id: insertedIds[i] };
    });
  };

  findOne = async <R extends T>(
    filter: Partial<WithId<R>>
  ): Promise<WithId<R> | undefined> => {
    const res = await this.connect("findOne", {
      filter: filter,
    });

    const doc = res.document;

    if (!doc) {
      return undefined;
    }

    return doc;
  };

  find = async <R extends T>({
    filter,
    sort,
  }: {
    filter: FilterOF<R>;
    sort?: Partial<{
      [key in keyof WithId<R>]: 1 | -1;
    }>;
  }): Promise<WithId<R>[]> => {
    const res = await this.connect("find", {
      filter: filter,
      sort: sort,
    });

    return res.documents.map((doc: any) => {
      return { ...doc, id: doc._id };
    });
  };

  updateOne = async <R extends T>({
    filter,
    update,
  }: {
    filter: FilterOF<R>;
    update: UpdateOf<R>;
  }): Promise<R> => {
    const res = await this.connect("updateOne", {
      filter: filter,
      update: update,
    });

    return res;
  };
}
