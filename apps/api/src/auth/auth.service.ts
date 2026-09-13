import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import type { JwtPayload } from './auth.types.js';
import { UsersService } from '../users/users.service.js';
import type { PublicUser } from '../users/user.types.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<PublicUser> {
    const passwordHash = await argon2.hash(registerDto.password);
    return this.usersService.create(
      registerDto.name,
      registerDto.email,
      passwordHash,
    );
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; tokenType: 'Bearer' }> {
    const user = await this.usersService.findByEmail(loginDto.email);
    const isPasswordValid = user
      ? await argon2.verify(user.passwordHash, loginDto.password)
      : false;

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      tokenType: 'Bearer',
    };
  }

  async getAuthenticatedUser(userId: string): Promise<PublicUser> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User is no longer available');
    }

    return this.usersService.toPublicUser(user);
  }
}