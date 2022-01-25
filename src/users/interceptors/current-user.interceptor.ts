import { UserService } from './../services/users.service';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {

  constructor(private userService: UserService) { }

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<any> {
    const req = context.switchToHttp().getRequest();
    if (req.session.userId) {
      const user = await this.userService.findOne(req.session.userId);
      user && (req.currentUser = user);
      return next.handle();
    }
    return next.handle();
  }
}