import { makeAutoObservable } from "mobx"

type message = {
    content: string,
    userId: number
}

type chat = {
    title: string,
    messages: message[]
}

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

    addMessageInChat(chatId: number, message: message) {
        this.chats[chatId].messages.push(message)
    }
}