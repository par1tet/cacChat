import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Chat } from "src/chats/chats.model";
import { User } from "src/users/users.model";

interface MessageCreateAttrs{
  text: string,
  userId: number,
  chatId: number,
}

@Table({tableName: "messages"})
export class Message extends Model<Message, MessageCreateAttrs> {
  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  id: number

  @Column({type: DataType.STRING, allowNull: false})
  text: string

  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER, allowNull: false})
  userId: number

  @BelongsTo(()=> User)
  auth: User

  @ForeignKey(() => Chat)
  @Column({type: DataType.INTEGER, allowNull: false})
  chatId: number

  @BelongsTo(()=> Chat)
  chat: Chat
}