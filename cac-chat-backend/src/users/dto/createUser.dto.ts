import { ApiProperty } from "@nestjs/swagger"

export class createUserDto {
    @ApiProperty({
        description: 'User nickname',
        default: "Par1tet"
    })
    readonly nickname: string
    @ApiProperty({
        description: 'User email',
        default: "par1tet.00@gmail.com"
    })
    readonly email: string
    @ApiProperty({
        description: 'User password',
        default: "123456gg"
    })
    readonly password: string
}