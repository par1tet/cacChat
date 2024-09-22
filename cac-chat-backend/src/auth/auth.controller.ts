import { Body, Controller, Post } from '@nestjs/common';
import { createUserDto } from 'src/users/dto/createUser.dto';
import { AuthService } from './auth.service';
import { auntitificateDto } from './dto/auntitificati.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({summary: "Вход в систему"})
    @Post('login')
    login(@Body() dto: createUserDto){
        return this.authService.login(dto)
    }

    @ApiOperation({summary: "Регистрация в системе"})
    @Post('registr')
    registration(@Body() dto: createUserDto){
        return this.authService.registration(dto)
    }

    @ApiOperation({summary: "Аутентификация в системе"})
    @Post('auntitificate')
    auntitificate(@Body() dto: auntitificateDto){
        return this.authService.auntitificate(dto.token)
    }
}
