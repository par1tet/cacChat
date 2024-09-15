export class CreateMessageDto {
  readonly text: string;
  readonly userToken: string;
  readonly chatId: number;
}