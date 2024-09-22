import { ApiProperty } from "@nestjs/swagger"

export class getUserByNameAndPassword{
    @ApiProperty({
        description: 'User email',
        default: "par1tet.00@gmail.com"
    })
    email: string
    @ApiProperty({
        description: 'User password',
        default: "123456gg"
    })
    password: string
}