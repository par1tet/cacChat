import { ApiProperty } from "@nestjs/swagger";

export class AddUserToChatDto {
    @ApiProperty({
        description: "User id",
        default: 1
    })
    readonly userId: number;
    @ApiProperty({
        description: "User another id",
        default: 2
    })
    readonly userAnotherId: number;
}
