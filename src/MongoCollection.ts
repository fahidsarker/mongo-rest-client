import { MongoConfig } from "./MongoConfig";
import { DBAction } from "./models/DBAction";
import { DeleteReturn } from "./models/DeleteReturn";
import { FilterOF } from "./models/FilterOf";
import { MaybeID } from "./models/MaybeID";
import { SortOf } from "./models/SortOf";
import { UpdateOf, UpdateReturn } from "./models/UpdateOf";
import { WithId } from "./models/WithId";

export type OptionalFuncInputData = {
  fetchConfig?: RequestInit;
};

export class MongoCollection<T> extends MongoConfig {
  protected readonly collection: string;

  constructor(config: MongoConfig & { collection: string }) {
    super(config);
    this.collection = config.collection;
  }

  protected connect = async <T>(
    action: DBAction,
    config: OptionalFuncInputData | undefined,
    body: {
      filter?: FilterOF<T>;
      sort?: SortOf<T>;
      update?: UpdateOf<T>;
      document?: MaybeID<T>;
      documents?: MaybeID<T>[];
    }
  ) => {
    const res = await fetch(this.baseUrl + "/action/" + action, {
      ...(config?.fetchConfig ?? this.defaultFetchConfig ?? {}),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": this.apiKey,
      },
      body: JSON.stringify({
        dataSource: this.clusterName,
        collection: this.collection,
        database: this.dbName,
        ...body,
      }),
    });

    const data = await res.json();
    return data;
  };

  insertOne = async (
    data: MaybeID<T>,
    config?: OptionalFuncInputData
  ): Promise<WithId<T>> => {
    const res = await this.connect("insertOne", config, {
      document: data,
    });

    const insertedId = res.insertedId;

    return { ...data, _id: insertedId };
  };

  insertMany = async (
    data: MaybeID<T>[],
    config?: OptionalFuncInputData
  ): Promise<WithId<T>[]> => {
    const res = await this.connect("insertMany", config, {
      documents: data,
    });

    const insertedIds = res.insertedIds;

    return data.map((doc, i) => {
      return { ...doc, _id: insertedIds[i] };
    });
  };

  findOne = async (
    filter: FilterOF<T>,
    config?: OptionalFuncInputData
  ): Promise<WithId<T> | undefined> => {
    const res = await this.connect("findOne", config, {
      filter: filter,
    });

    const doc = res.document;

    if (!doc) {
      return undefined;
    }

    return doc;
  };

  find = async (
    body?: {
      filter: FilterOF<T>;
      sort?: SortOf<T>;
    },
    config?: OptionalFuncInputData
  ): Promise<WithId<T>[]> => {
    const res = await this.connect("find", config, body ?? {});

    return res.documents;
  };

  updateOne = async (
    filter: FilterOF<T>,
    update: UpdateOf<T>,
    config?: OptionalFuncInputData
  ): Promise<UpdateReturn> =>
    this.connect("updateOne", config, {
      filter,
      update,
    });

  updateMany = async (
    filter: FilterOF<T>,
    update: UpdateOf<T>,
    config?: OptionalFuncInputData
  ): Promise<UpdateReturn> =>
    this.connect("updateMany", config, {
      filter,
      update,
    });

  deleteOne = async (
    filter: FilterOF<T>,
    config?: OptionalFuncInputData
  ): Promise<DeleteReturn> => this.connect("deleteOne", config, { filter });

  deleteMany = async (
    filter: FilterOF<T>,
    config?: OptionalFuncInputData
  ): Promise<DeleteReturn> => this.connect("deleteMany", config, { filter });
}
