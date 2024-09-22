import { ApiProperty } from "@nestjs/swagger";

export class AddUserToChatDto {
    @ApiProperty({
        description: "User id",
        default: 1
    })
    readonly userId: number;
    @ApiProperty({
        description: "Chat id",
        default: 1
    })
    readonly chatId: number;
}
