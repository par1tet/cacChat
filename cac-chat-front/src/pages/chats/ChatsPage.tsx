import { useEffect } from "react";
import cl from "./ChatsPage.module.css";
import vite from "/vite.svg";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
type Props = {};

export default function ChatsPage({}: Props) {
	const navigate = useNavigate()

	const chatList = [
		{
			title: "hello",
			img: vite,
			lastMessage: "hello, world",
			chatId: 0,
		},
		{
			title: "hello",
			img: vite,
			lastMessage: "hello, world",
			chatId: 1,
		},
		{
			title: "hello",
			img: vite,
			lastMessage: "hello, world",
			chatId: 2,
		}
	];

	const messageList = [
		{
			content: "hello",
			type: 'me',
		},
		{
			content: "how are u",
			type: 'me',
		},
		{
			content: "hi",
			type: 'another',
		},
		{
			content: "okay, are u?",
			type: 'another',
		},
	];

	useEffect(() => {
		if(!localStorage.getItem('token')){
			navigate('/')
		}
	}, [chatList]);

	return (
		<div className={cl["chatscontent"]}>
			<div className={cl["chatscontent__chats"]}>{
				chatList.map(element =>
					<div key={element.chatId} className={clsx(cl["chat_block"],cl["block"])}>
						<img src={element.img} />
						<div className={cl["infocolumn"]}>
							<p className={cl["title"]}>{element.title}</p>
							<p className={cl["lastmessage"]}>{element.lastMessage}</p>
						</div>
					</div>
				)
			}</div>
			<div className={cl["chatscontent__chatmessages"]}>
				<div className={cl['messages']}>
					{messageList.map(message =>
						<div className={cl[`messagewrapper`]}>
							<span className={clsx(cl[`message`], cl[`message-${message.type}`])}>{message.content}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
