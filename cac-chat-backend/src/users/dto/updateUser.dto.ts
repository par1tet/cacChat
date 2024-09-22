import { ApiProperty } from "@nestjs/swagger"

export class updateUserDto {
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
        description: 'User hash password',
        default: "$2a$05$be71fx/RG7M4mC7SG6dKWOacUTJ27NZVq1Y27KyBGZDghsixY1QHu"
    })
    readonly password: string
    @ApiProperty({
        description: 'User id',
        default: 1
    })
    readonly id: number
}