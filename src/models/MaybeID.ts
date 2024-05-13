import { WithId } from "./WithId";

export type MaybeID<T> = T | WithId<T>;
