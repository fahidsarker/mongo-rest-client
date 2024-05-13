import { WithId } from "./WithId";

export type SortOf<T> = Partial<{
  [key in keyof WithId<T>]: 1 | -1;
}>;
