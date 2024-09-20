import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/services/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.mysql-entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserCreatedEvent } from '../../events/consumers/auth/user-created.event';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private eventEmitter: EventEmitter2,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      return null;
    }
    return user;
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string, user: any}>
  {
    const user = await this.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userWithoutPassword = { ...user, password: undefined };

    const payload = { email: user.email, sub: user.id };
    return { 
      access_token: this.jwtService.sign(payload),
       user: userWithoutPassword
    };
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return bcrypt.hash(password, salt);
  }

  async register(registerDto: RegisterDto): Promise<{ access_token: string }> {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await this.hashPassword(registerDto.password);
    registerDto.password = hashedPassword;

    const user = await this.usersService.create(registerDto);

    this.eventEmitter.emit('user.created', new UserCreatedEvent(user.id));

    const payload = { email: user.email, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
