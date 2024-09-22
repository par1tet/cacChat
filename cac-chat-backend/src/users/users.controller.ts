import { Controller, Get, Body, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/createUser.dto';
import { getUserDto } from './dto/getUser.dto';
import { updateUserDto } from './dto/updateUser.dto';
import { deleteUserDto } from './dto/deleteUser.dto';
import { searchUserByNickname } from './dto/searchUserByNickname.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @ApiOperation({summary: "Получение всех пользователей"})
    @Get('get_users')
    getUsers(){
        return this.usersService.getUsers()
    }

    @ApiOperation({summary: "Создание пользователя"})
    @Post('create_user')
    async createUser(@Body() userDto: createUserDto){
        return (await this.usersService.createUser(userDto))
    }

    @ApiOperation({summary: "Получение пользователя по email"})
    @Post('get_user')
    getUser(@Body() userDto: getUserDto){
        return this.usersService.getUser(userDto)
    }
    
    @ApiOperation({summary: "Обновление данных пользователя по id"})
    @Post('update_user')
    updateUser(@Body() userDto: updateUserDto){
        return this.usersService.updateUser(userDto)
    }

    @ApiOperation({summary: "Удаление пользователя"})
    @Post('delete_user')
    deleteUser(@Body() userDto: deleteUserDto){
        return this.usersService.deleteUser(userDto)
    }

    @ApiOperation({summary: "Поиск пользователя"})
    @Post('search_user')
    searchUser(@Body() dto: searchUserByNickname){
        return this.usersService.searchUserByNickname(dto)
    }
}
