import { ApiProperty } from "@nestjs/swagger";

export class deleteUserDto {
    @ApiProperty({
        description: 'User id',
        default: 1
    })
    readonly userId: number
}