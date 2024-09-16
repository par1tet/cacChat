import { Column, Table, DataType, Model, BelongsToMany } from "sequelize-typescript";
import { UserChat } from "src/chats/chat-user.model";
import { Chat } from "src/chats/chats.model";

interface UserCreateAttrs {
    email: string,
    password: string,
    nickname: string
}

@Table({tableName: 'users'})
export class User extends Model<User, UserCreateAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING})
    nickname: string;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;

    @Column({type: DataType.STRING})
    password: string;

    @BelongsToMany(() => Chat, () => UserChat)
    chats: Chat[];
}
