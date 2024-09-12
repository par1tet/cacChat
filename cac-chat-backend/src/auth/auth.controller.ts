import { Body, Controller, Post } from '@nestjs/common';
import { createUserDto } from 'src/users/dto/createUser.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    login(@Body() dto: createUserDto){
        return this.authService.login(dto)
    }

    @Post('registr')
    registration(@Body() dto: createUserDto){
        return this.authService.registration(dto)
    }
}
