
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.mysql-entity';


@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (user && await bcrypt.compare(loginDto.password, user.password)) {
      return user;

    }
    return null;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return bcrypt.hash(password, salt);
  }

  async register(registerDto: RegisterDto): Promise<string> {
    const hashedPassword = await this.hashPassword(registerDto.password);
    registerDto.password = hashedPassword;
    const user  = await this.usersService.create(registerDto);

    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

}
