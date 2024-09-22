import { ApiProperty } from "@nestjs/swagger";

export class FindAllChatUsers {
    @ApiProperty({
        description: "Chat id",
        default: 1
    })
    readonly chatId: number;
}
