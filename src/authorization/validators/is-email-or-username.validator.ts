import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Strings } from '../../data/strings';

@ValidatorConstraint({ async: false })
class IsUsernameOrEmailConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as any;

    return !!object.username || !!object.email;
  }

  defaultMessage(args: ValidationArguments) {
    return Strings.loginDataValidation;
  }
}

export function IsUsernameOrEmail(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUsernameOrEmailConstraint,
    });
  };
}
