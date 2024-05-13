import { MongoConfig } from "./MongoConfig";
import { DBAction } from "./models/DBAction";
import { DeleteReturn } from "./models/DeleteReturn";
import { FilterOF } from "./models/FilterOf";
import { MaybeID } from "./models/MaybeID";
import { SortOf } from "./models/SortOf";
import { UpdateOf, UpdateReturn } from "./models/UpdateOf";
import { WithId } from "./models/WithId";

export class MongoCollection<T> extends MongoConfig {
  protected readonly collection: string;

  constructor(config: MongoConfig & { collection: string }) {
    super(config);
    this.collection = config.collection;
  }

  protected connect = async <T>(
    action: DBAction,
    body: {
      filter?: FilterOF<T>;
      sort?: SortOf<T>;
      update?: UpdateOf<T>;
      document?: MaybeID<T>;
      documents?: MaybeID<T>[];
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

  insertOne = async (data: MaybeID<T>): Promise<WithId<T>> => {
    const res = await this.connect("insertOne", {
      document: data,
    });

    const insertedId = res.insertedId;

    return { ...data, _id: insertedId };
  };

  insertMany = async (data: MaybeID<T>[]): Promise<WithId<T>[]> => {
    const res = await this.connect("insertMany", {
      documents: data,
    });

    const insertedIds = res.insertedIds;

    return data.map((doc, i) => {
      return { ...doc, _id: insertedIds[i] };
    });
  };

  findOne = async (filter: FilterOF<T>): Promise<WithId<T> | undefined> => {
    const res = await this.connect("findOne", {
      filter: filter,
    });

    const doc = res.document;

    if (!doc) {
      return undefined;
    }

    return doc;
  };

  find = async (body?: {
    filter: FilterOF<T>;
    sort?: SortOf<T>;
  }): Promise<WithId<T>[]> => {
    const res = await this.connect("find", body ?? {});

    return res.documents;
  };

  updateOne = async (body?: {
    filter: FilterOF<T>;
    update: UpdateOf<T>;
  }): Promise<UpdateReturn> => this.connect("updateOne", body ?? {});

  updateMany = async (body?: {
    filter: FilterOF<T>;
    update: UpdateOf<T>;
  }): Promise<UpdateReturn> => this.connect("updateMany", body ?? {});

  deleteOne = async (filter: FilterOF<T>): Promise<DeleteReturn> =>
    this.connect("deleteOne", { filter });

  deleteMany = async (filter: FilterOF<T>): Promise<DeleteReturn> =>
    this.connect("deleteMany", { filter });
}
