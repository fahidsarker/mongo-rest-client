import { WithId } from "./WithId";

export type FilterOF<T> = Partial<
  T & {
    _id: {
      $oid: string;
    };
  }
>;
