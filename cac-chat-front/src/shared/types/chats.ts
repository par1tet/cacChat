export type message = {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
};

export type ChatUser = {
  email: string;
  id: number;
  nickname : string;
}

export type chat = {
  id: number;
  title: string;
  messages: message[];
  type: string;
  users: ChatUser[]
};
