import { Column, Table, DataType, Model, HasMany, BelongsToMany } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { UserChat } from "./chat-user.model";

interface ChatCreateAttrs {
    title: string,
    userId: number,
}

@Table({tableName: 'chats'})
export class Chat extends Model<Chat, ChatCreateAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @Column({type: DataType.STRING, allowNull: false})
    title: string;
    
    @Column({type: DataType.INTEGER, allowNull: false})
    userId: number

    @BelongsToMany(()=>User, ()=> UserChat)
    users: User[];
}