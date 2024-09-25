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

    createChat(title: string){
        this.chats.push({
            "id": this.chats.length,
            "title":title,
            "messages": []
        })
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
            const candidate = this.chats.find(chat => chat.id === chatId)?.messages
            if(candidate) message.id = candidate.length
        }
        if(message.createdAt === undefined){
            message.createdAt = ''
        }
        this.chats.find(chat => chat.id === chatId)?.messages.push(message as any)
        if(effect){
            effect()
        }
    }
}