import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly issuer: string;
  private readonly audiance: string;

  private readonly jwks: ReturnType<typeof createRemoteJWKSet>;

  constructor(private readonly configService: ConfigService) {
    const domain = this.configService.getOrThrow<string>('AUTH0_DOMAIN');
    this.audiance = this.configService.getOrThrow<string>('AUTH0_AUDIENCE');
    this.issuer = this.configService.getOrThrow<string>('AUTH0_ISSUER');

    this.jwks = createRemoteJWKSet(
      new URL(`https://${domain}/.well-known/jwks.json`),
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing access token');
    }

    const token = authorization.substring(7);

    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: this.issuer,
        audience: this.audiance,
      });

      req.user = payload;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
