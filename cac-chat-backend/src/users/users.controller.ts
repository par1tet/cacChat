import { Controller, Get, Body, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/createUser.dto';
import { getUserDto } from './dto/getUser.dto';
import { updateUserDto } from './dto/updateUser.dto';
import { deleteUserDto } from './dto/deleteUser.dto';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('get_users')
    getUsers(){
        return this.usersService.getUsers()
    }

    @Post('create_user')
    async createUser(@Body() userDto: createUserDto){
        return (await this.usersService.createUser(userDto))
    }

    @Post('get_user')
    getUser(@Body() userDto: getUserDto){
        return this.usersService.getUser(userDto)
    }
    
    @Post('update_user')
    updateUser(@Body() userDto: updateUserDto){
        return this.usersService.updateUser(userDto)
    }

    @Post('delete_user')
    deleteUser(@Body() userDto: deleteUserDto){
        return this.usersService.deleteUser(userDto)
    }
}
