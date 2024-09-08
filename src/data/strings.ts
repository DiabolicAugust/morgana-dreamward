import { Entities, Fields } from './enums/strings.enum';

export const Strings = {
  fieldCantBeEmpty: (field: Fields) => `${field} can't be empty!`,
  fieldMustBeString: (field: Fields) => `${field} must be string!`,
  fieldMustBeEmail: (field: Fields) =>
    `${field} must be in a correct email format!`,

  fieldTooShort: (field: string, min: number) =>
    `${field} must be at least ${min} characters long.`,
  fieldTooLong: (field: string, max: number) =>
    `${field} cannot be longer than ${max} characters.`,

  //errors
  entityWasNotFoundById: (entity: Entities, id: string | number) =>
    `${entity} was not found by this id: ${id}`,
  //errors
  entityWasNotFoundByField: (entity: Entities, field: Fields, data: string) =>
    `${entity} was not found by ${field}: ${data}`,

  noEntityWithField: (entity: Entities, field: Fields, data: any) =>
    `There is no ${entity} with this ${field}: ${data}`,

  wrongField: (field: Fields) => `Wrong ${field}`,

  somethingWentWrong: 'Something went wrong!',
  entityDeleted: (entity: Entities) =>
    `${entity} has been successfully deleted`,

  entityUpdated: (entity: Entities) =>
    `${entity} has been successfully updated`,

  entityAlreadyApproved: (entity: Entities) => `${entity} is aready approved'`,

  entityApproved: (entity: Entities) => `${entity} was approved'`,

  emailAlreadyVerified: 'This email is already verified!',
  emailVerifySuccess: 'Your email was successfully verified!',
  notAllowedApproveFriendship: 'You are not allowed to approve this friendship',
  notAuthor: 'You are not the author of this entity',
  isAuthor: 'Requestor is an author of the entity',
  loginDataValidation: 'Either username or email must be provided',
  wrongPassword: 'Wrong password',
  wrongToken: 'Wrong token',
  successfulVerification: 'Successfuly verified',
  tokenSent: 'Token was sent',
};
