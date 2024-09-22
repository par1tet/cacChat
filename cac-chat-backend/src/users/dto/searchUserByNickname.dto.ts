import { ApiProperty } from '@nestjs/swagger';

export class searchUserByNickname {
    @ApiProperty({
        description: 'User nickname',
        default: 'Par1tet',
    })
    readonly nickname: string;
}
