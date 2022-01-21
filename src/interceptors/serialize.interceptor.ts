import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

export class SerializeInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    console.log('__________Run befor handler_______', context)

    return next.handle()
      .pipe(
        map(data => {
          console.log('______Run before respons____', data);
          return data;
        })
      )
  };
}