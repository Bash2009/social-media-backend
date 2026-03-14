import { IsNotEmpty, IsString } from 'class-validator';
import { LoginDto } from './login.dto';

export class RefreshTokenDto extends LoginDto {}
