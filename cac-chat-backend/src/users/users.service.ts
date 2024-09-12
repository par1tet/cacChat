import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    getUser() {
        return [{'user': {id: 123, name: 'maxim'}}]
    }
}
