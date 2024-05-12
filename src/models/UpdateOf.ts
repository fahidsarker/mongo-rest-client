export type UpdateOf<T> = {
  $currentDate?: Record<keyof T, boolean>;
  $inc?: Partial<T>;
  $min?: Partial<T>;
  $max?: Partial<T>;
  $mul?: Partial<T>;
  $rename?: Record<keyof T, string>;
  $set?: Partial<T>;
  $setOnInsert?: Partial<T>;
  $unset?: Partial<T>;
};
