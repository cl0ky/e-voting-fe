export interface InfiniteList<T> {
  perPage: number;
  next: string;
  items: T[];
}
