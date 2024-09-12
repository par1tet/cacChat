import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createUserDto } from 'src/users/dto/createUser.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs'
import { User } from 'src/users/users.model';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService,private jwtService: JwtService){}

    async login(dto: createUserDto){
    }


    async registration(dto: createUserDto){
        const candidate = await this.usersService.getUser({email: dto.email})

        if(candidate){
            throw new HttpException('Такой пользователь уже существует', HttpStatus.BAD_REQUEST)
        }

        const hashPassword: string = await bcrypt.hash(dto.password, 5)

        console.log(hashPassword)

        return this.generateToken((await this.usersService.createUser({
            ...dto,
            password: hashPassword
        })))
    }

    async generateToken(user: User) {
        return {
            token: this.jwtService.sign({
                email: user.email,
                id: user.id
            })
        }
    }
}
