import { CustomResponseType } from './custom-response-type';
import { ErrorResponse } from './entities/error-response';
import { MyResponse } from './entities/my-response';
import { SuccessResponse } from './entities/success-response';
import type { Response } from 'express';

export class CustomResponse {
  public static async handleResponse<T>(
    res: Response,
    fun: () => Promise<MyResponse<T>>,
  ): Promise<void> {
    let myResponse: MyResponse<T>;
    try {
      myResponse = await fun();
      if (myResponse === undefined) {
        myResponse = new ErrorResponse(
          400,
          CustomResponseType.unknown_error,
          'undefined',
        );
      }
    } catch (error: any) {
      if (error instanceof ErrorResponse) {
        myResponse = error;
      } else {
        myResponse = new ErrorResponse(
          400,
          CustomResponseType.unknown_error,
          error?.message || error,
        );
      }
    }
    res.status(myResponse.getCode()).json(myResponse.toJSON());
  }
}
