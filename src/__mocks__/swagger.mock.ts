export const ApiProperty = (options?: any) => (_target: any, _key: string) => {};
export const ApiPropertyOptional = (options?: any) => (_target: any, _key: string) => {};
export const ApiTags = () => (_target: any) => {};
export const ApiOperation = () => (_target: any) => {};
export const ApiResponse = () => (_target: any) => {};
export const ApiBody = () => (_target: any) => {};
export const ApiQuery = () => (_target: any) => {};
export const ApiExtraModels = () => (_target: any) => {};
export const ApiOkResponse = () => (_target: any) => {};
export const ApiBearerAuth = () => (_target: any) => {};
export const ApiPaginatedResponse = () => (_target: any) => {};

export class DocumentBuilder {
  setTitle(title: string) { return this; }
  setDescription(desc: string) { return this; }
  setVersion(ver: string) { return this; }
  addTag(tag: string) { return this; }
  addBearerAuth() { return this; }
  addServer(url: string, desc?: string) { return this; }
  build() { return {}; }
}

export class SwaggerModule {
  static createDocument(app: any, config: any) { return {}; }
  static setup(path: string, app: any, document: any, options?: any) {}
}
