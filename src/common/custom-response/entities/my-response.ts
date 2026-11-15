export abstract class MyResponse<T> {
  constructor() {}
  abstract toJSON(): any;
  abstract getCode(): number;
}
