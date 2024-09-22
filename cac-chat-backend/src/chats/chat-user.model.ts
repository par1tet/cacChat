import {
    Column,
    Table,
    DataType,
    ForeignKey,
    Model,
} from 'sequelize-typescript';
import { User } from 'src/users/users.model';
import { Chat } from './chats.model';

@Table({ tableName: 'user_chat' })
export class UserChat extends Model<UserChat> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ForeignKey(() => Chat)
    @Column({ type: DataType.INTEGER })
    chatId: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number;
}
