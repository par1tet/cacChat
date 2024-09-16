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
}