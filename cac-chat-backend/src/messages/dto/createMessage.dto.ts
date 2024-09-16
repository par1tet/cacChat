export class CreateMessageDto {
  readonly content: string;
  readonly userToken: string;
  readonly chatId: number;
}