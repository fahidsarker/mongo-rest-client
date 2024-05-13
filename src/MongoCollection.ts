import { MongoConfig } from "./MongoConfig";
import { DBAction } from "./models/DBAction";
import { DeleteReturn } from "./models/DeleteReturn";
import { FilterOF } from "./models/FilterOf";
import { SortOf } from "./models/SortOf";
import { UpdateOf, UpdateReturn } from "./models/UpdateOf";
import { WithId } from "./models/WithId";

export class MongoCollection<T> extends MongoConfig {
  protected readonly collection: string;

  constructor(config: MongoConfig & { collection: string }) {
    super(config);
    this.collection = config.collection;
  }

  protected connect = async <R extends T>(
    action: DBAction,
    body: {
      filter?: FilterOF<R>;
      sort?: SortOf<R>;
      update?: UpdateOf<R>;
      document?: R;
      documents?: R[];
    }
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
    filter: FilterOF<R>
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

  find = async <R extends T>(body?: {
    filter: FilterOF<R>;
    sort?: SortOf<R>;
  }): Promise<WithId<R>[]> => {
    const { filter, sort } = body ?? {};
    const res = await this.connect("find", {
      filter: filter,
      sort: sort,
    });

    return res.documents;
  };

  updateOne = async <R extends T>(body?: {
    filter: FilterOF<R>;
    update: UpdateOf<R>;
  }): Promise<UpdateReturn> => {
    return await this.connect("updateOne", body ?? {});
  };

  updateMany = async <R extends T>(body?: {
    filter: FilterOF<R>;
    update: UpdateOf<R>;
  }): Promise<UpdateReturn> => {
    return await this.connect("updateMany", body ?? {});
  };

  deleteOne = async <R extends T>(
    filter: FilterOF<R>
  ): Promise<DeleteReturn> => {
    return await this.connect("deleteOne", { filter });
  };

  deleteMany = async <R extends T>(
    filter: FilterOF<R>
  ): Promise<DeleteReturn> => {
    return await this.connect("deleteMany", { filter });
  };
}
