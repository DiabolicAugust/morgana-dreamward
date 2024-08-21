import { Entities, Fields } from './enums/strings.enum.ts';

export class StringsService {
  errorTexts = {
    noEntityWithField: (entity: Entities, field: Fields, data: any) =>
      `There is no ${entity} with this ${field}: ${data}`,
  };
}
