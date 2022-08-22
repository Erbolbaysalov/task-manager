import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { JwtPayloadInterface } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly userRepository: Repository<User>;

  constructor(dataSource: DataSource) {
    super({
      secretOrKey: 'topSecret51',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    });
    this.userRepository = dataSource.getRepository(User);
  }

  async validate(payload: JwtPayloadInterface): Promise<User> {
    const { username } = payload;
    const user: User = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
