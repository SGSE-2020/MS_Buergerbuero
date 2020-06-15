export interface ApiModel<T> {
  status: string;
  code: string;
  message: string;
  param: T[];
}
