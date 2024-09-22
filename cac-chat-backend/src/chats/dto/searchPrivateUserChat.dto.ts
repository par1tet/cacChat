import { ApiProperty } from "@nestjs/swagger";

export class SearchPrivateUserChatDto {
    @ApiProperty({
        description: "Array of User id",
        default: [1, 2]
    })
    readonly users: Array<number>;
}
