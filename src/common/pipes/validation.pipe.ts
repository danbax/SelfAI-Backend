import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    // If there's no metatype or it shouldn't be validated, return the value as is
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // Transform the plain object to an instance of the metatype
    const object = plainToInstance(metatype, value);

    // Perform validation
    const errors = await validate(object);

    if (errors.length > 0) {
      // Extract and format validation errors
      const formattedErrors = this.formatErrors(errors);
      throw new BadRequestException({
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    return value;
  }

  // Determine if the metatype should be validated
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  // Format validation errors into a more readable structure
  private formatErrors(errors: any[]) {
    return errors.map(err => {
      return {
        property: err.property,
        constraints: err.constraints,
        // Optionally include nested errors if there are any
        children: err.children?.length
          ? this.formatErrors(err.children)
          : undefined,
      };
    });
  }
}
