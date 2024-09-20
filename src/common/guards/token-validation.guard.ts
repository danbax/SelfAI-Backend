import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; // Assuming you are using JWT for tokens

@Injectable()
export class TokenValidationGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-api-key'];
    
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const payload = this.jwtService.verify(token);
      request.user = { id: parseInt(payload.sub, 10) };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
