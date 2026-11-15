import { CustomResponseType } from '../custom-response-type';
import { MyResponse } from './my-response';

export class ErrorResponse extends MyResponse<any> {
  constructor(
    private readonly code: number,
    private readonly type: CustomResponseType,
    private readonly message?: any,
  ) {
    super();
  }

  toJSON() {
    return {
      type: this.type,
      message: this.message,
    };
  }

  getCode(): number {
    return this.code;
  }

  static build(body: {
    code?: number;
    type: CustomResponseType;
    message?: string;
  }) {
    return new ErrorResponse(body.code ?? 400, body.type, body.message);
  }
}
