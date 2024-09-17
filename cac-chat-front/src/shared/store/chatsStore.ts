import { makeAutoObservable } from "mobx"
import { chat } from "../types/chats"
import { message } from "../types/chats"

export class chatsStore {
    chats: chat[] = []
    currentChat: number = -1

    constructor(){
        makeAutoObservable(this)
    }

    setChats(newValue: chat[]){
        this.chats = newValue
    }

    setCurrentChat(idChat: number) {
        this.currentChat = idChat
    }

    addMessageInChat(chatId: number, message: {
        userId: number,
        content: string,
        id?: number,
        createdAt?: string
    }, effect?: () => any) {
        if(message.id === undefined){
            message.id = this.chats[chatId].messages.length
        }
        if(message.createdAt === undefined){
            message.createdAt = ''
        }

        this.chats[chatId].messages.push(message as any)
        if(effect){
            effect()
        }
    }
}