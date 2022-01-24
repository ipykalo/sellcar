import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { ClassConstructor, plainToClass } from "class-transformer";
import { map, Observable } from "rxjs";

/**
 * Custom Decorator
 * @param dto DTO
 */
export function Serialize(dto: ClassConstructor<object>): MethodDecorator & ClassDecorator {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {

  constructor(private dto: ClassConstructor<object>) { }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<object> {
    return next.handle()
      .pipe(
        map(data => plainToClass(this.dto, data, { excludeExtraneousValues: true }))
      );
  };
}