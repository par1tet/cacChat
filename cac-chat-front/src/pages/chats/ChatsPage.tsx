import { useEffect } from "react";
import cl from "./ChatsPage.module.css";
import vite from "/vite.svg";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import fiolBurger from './../../../public/fiol_burger.png'
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
			<div className={cl["chatscontent__chats"]}>
				<div className={cl["chatscontent__chats-manage"]}>
					<button onClick={e => console.log('hello world')}>
						<img src={fiolBurger} alt="burger" />
					</button>
				</div>
				<div className={cl["chatscontent__chats-list"]}>{
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
			</div>
			<div className={cl["chatscontent__chatmessages"]}>
				<div className={cl['messages']}>
					{messageList.map((message, index) =>
						<div className={cl[`messagewrapper`]} key={index}>
							<span className={clsx(cl[`message`], cl[`message-${message.type}`])}>{message.content}</span>
						</div>
					)}
				</div>
				<div className={cl['inputmessage']}>
					<input type="text" placeholder="Enter message..."/>
				</div>
			</div>
		</div>
	);
}
