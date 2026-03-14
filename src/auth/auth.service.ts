import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Returns an access and refresh jwt in that order
  private async getTokens(uid) {
    return [
      await this.jwtService.signAsync(
        { sub: uid },
        { secret: this.configService.get<string>('JWT_SECRET') },
      ),
      await this.jwtService.signAsync(
        { sub: uid },
        { secret: this.configService.get<string>('JWT_REFRESH_SECRET') },
      ),
    ];
  }

  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      const [access_token, refresh_token] = await this.getTokens(user.uid);

      return { ...user, access_token, refresh_token };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneById(loginDto.uid);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const [access_token, refresh_token] = await this.getTokens(user.uid);

    return { ...user, access_token, refresh_token };
  }

  async refreshToken(uid: string) {
    const [access_token, refresh_token] = await this.getTokens(uid);
    return { access_token, refresh_token };
  }
}
