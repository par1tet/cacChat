export type message = {
	id: number,
	content: string,
	createdAt: string,
	userId: number,
}

export type chat = {
    title: string,
    messages: message[]
}