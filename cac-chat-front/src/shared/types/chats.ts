export type message = {
    content: string,
    userId: number
}

export type chat = {
    title: string,
    messages: message[]
}