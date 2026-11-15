import { CustomResponseType } from '../custom-response-type';
import { MyResponse } from './my-response';

export class SuccessResponse<T> extends MyResponse<T> {
  constructor(
    public readonly code: number,
    public readonly type?: string,
    public readonly message?: string,
    public readonly data?: T,
  ) {
    super();
  }

  toJSON(): any {
    if (this.type !== undefined || this.message !== undefined)
      return {
        type: this.type,
        message: this.message,
        data: this.data,
      };
    return this.data;
  }

  getCode(): number {
    return this.code;
  }

  static build<T>(body: {
    code?: number;
    type?: CustomResponseType;
    message?: string;
    data?: T;
  }): SuccessResponse<T> {
    return new SuccessResponse<T>(
      body.code ?? 200,
      body.type,
      body.message,
      body.data,
    );
  }
}
