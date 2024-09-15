import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createUserDto } from 'src/users/dto/createUser.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/users.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}


  async login(dto: createUserDto) {
    const user = await this.validateUser(dto);

    return this.generateToken(user);
  }

  async registration(dto: createUserDto) {
    const candidate = await this.usersService.getUser({ email: dto.email });

    if (candidate) {
      throw new HttpException(
        'Такой пользователь уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword: string = await bcrypt.hash(dto.password, 5);

    console.log(hashPassword);

    return this.generateToken(
      await this.usersService.createUser({
        ...dto,
        password: hashPassword,
      }),
    );
  }

  async generateToken(user: User) {
    return {
      token: this.jwtService.sign({
        email: user.email,
        id: user.id,
        nickname: user.nickname
      }),
    };
  }

  private async validateUser(dto: createUserDto) {
    const user: User = await this.usersService.getUser(dto);
    const isPasswordEquals: boolean = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (user && isPasswordEquals) {
      return user;
    }

    throw new UnauthorizedException({
      message: 'Некоректный email или пароль',
    });
  }

  async auntitificate(jwtToken: string) {
    try {
      this.jwtService.decode(jwtToken);
    } catch {
      throw new HttpException(
        'Не получилось аунтитифицироваться',
        HttpStatus.BAD_REQUEST,
      );
    }

    const decodeToken = this.jwtService.decode(jwtToken);

    if (decodeToken) {
      const candidate = await this.usersService.getUser(
        this.jwtService.decode(jwtToken),
      );

      console.log(candidate);

      if (candidate) {
        return candidate;
      } else {
        throw new HttpException(
          'Не получилось аунтитифицироваться',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException(
        'Не получилось аунтитифицироваться',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
