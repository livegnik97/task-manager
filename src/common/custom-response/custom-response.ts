import { NotFoundException, BadRequestException } from '@nestjs/common';
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
      } else if (error instanceof NotFoundException) {
        myResponse = new ErrorResponse(
          404,
          CustomResponseType.not_found,
          error.message,
        );
      } else if (error instanceof BadRequestException) {
        myResponse = new ErrorResponse(
          400,
          CustomResponseType.invalid_field,
          error.message,
        );
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
