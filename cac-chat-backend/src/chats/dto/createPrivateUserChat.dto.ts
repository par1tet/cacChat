import { ApiProperty } from "@nestjs/swagger";

export class CreatePrivateUserChatDto {
    @ApiProperty({
        description: "User token",
        default: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFudGhvbnkucGFuLjAwQGdtYWlsLmNvbSIsImlkIjozLCJuaWNrbmFtZSI6IlM3YjB0NCIsImlhdCI6MTcyNzAwNTk2MiwiZXhwIjoxNzkwMTIxMTYyfQ.YLlbLhj6CgCBnlqKaa3ndCpsRL-LSiadO6Cs2MsLUjU'
    })
    readonly userToken: string;
    @ApiProperty({
        description: "Array of User id",
        default: [1, 2]
    })
    readonly users: Array<number>;
}