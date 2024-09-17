import { makeAutoObservable } from "mobx";
import { chatsStore } from "./chatsStore";

export class rootStore {
    chatsStore: chatsStore = new chatsStore()

    constructor() {
        makeAutoObservable(this)
    }
}