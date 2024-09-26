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

    createChat(dto: chat, myNickname: string){
        if(dto.type == "privateChat"){
            console.log(myNickname)
            let title = dto.title
            if(dto.users.length == 2){
                title = dto.users.filter((e) => {return e.nickname != myNickname})[0].nickname
            }
            this.chats.push({
                "id": dto.id,
                "title": title,
                "messages": [],
                "type": dto.type,
                "users": dto.users
            })
        }
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