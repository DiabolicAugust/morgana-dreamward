export interface PaginationType<T> {
  data: T[];
  count: number;
  page: number;
  amount: number;
  more: boolean;
  pages: number;
}
