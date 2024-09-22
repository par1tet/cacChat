import { ApiProperty } from "@nestjs/swagger";

export class getUserDto {
    @ApiProperty({
        description: 'User email',
        default: "par1tet.00@gmail.com"
    })
    readonly email: string
}