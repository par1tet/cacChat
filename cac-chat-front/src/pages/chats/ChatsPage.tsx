import { useEffect } from "react";
import cl from "./ChatsPage.module.css";
import vite from "/vite.svg";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import fiolBurger from './../../../public/fiol_burger.png'
import fiolBack from './../../../public/fiol_back.png'
import { useRef } from "react";
import { jwtDecode } from "jwt-decode";
type Props = {};

type tokenPayload = {
	email: string,
	id: number,
	nickname: string
}

export default function ChatsPage({}: Props) {
	const navigate = useNavigate()
	const sideBarRef = useRef<HTMLDivElement>(null)

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

	function handleClick(e: any) {
		if(!sideBarRef.current) return undefined
		sideBarRef.current.style.transform = 'matrix(1, 0, 0, 1, 0, 0)'
	}

	function handleClickClose(e: any) {
		if(!sideBarRef.current) return undefined

		console.log(jwtDecode((localStorage.getItem('token') as string)))

		const computedStylesSideBar = getComputedStyle(sideBarRef.current)
		sideBarRef.current.style.transform = `matrix(1, 0, 0, 1, -${computedStylesSideBar.width.slice(0, -2)}, 0)`
	}

	return (
		<div className={cl["chatscontent"]}>
			<div className={cl["chatscontent__chats"]}>
				<div className={cl["chatscontent__chats-manage"]}>
					<button onClick={handleClick}>
						<img src={fiolBurger} alt="burger" draggable={false}/>
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
				<div className={cl["chatscontent__chats-sidebar"]} ref={sideBarRef}>
					<div className={cl["chatscontent__chats-sidebar-manage"]}>
						<button onClick={handleClickClose}>
							<img src={fiolBack} alt="burger" draggable={false}/>
						</button>
						<span>{(jwtDecode((localStorage.getItem('token') as string)) as tokenPayload).nickname}</span>
						<div></div>
					</div>
				</div>
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
