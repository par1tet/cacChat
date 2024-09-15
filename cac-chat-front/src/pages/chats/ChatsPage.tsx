import { useEffect, useState } from "react";
import cl from "./ChatsPage.module.css";
import vite from "/vite.svg";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import fiolBurger from './../../../public/fiol_burger.png'
import fiolBack from './../../../public/fiol_back.png'
import { useRef } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { serverLink } from "../../shared/api/serverLink";
type Props = {};

type tokenPayload = {
	email: string,
	id: number,
	nickname: string
}

type chat = {
	title: string,
	id: number
}

export default function ChatsPage({}: Props) {
	const navigate = useNavigate()
	const sideBarRef = useRef<HTMLDivElement>(null)
	const modalCreateWindowRef = useRef<HTMLDivElement>(null)
	const [chatList, setChatList] = useState<chat[]>([])

	useEffect(() => {
		axios.post(serverLink('chats/list'), {
			userToken: localStorage.getItem('token')
		})
		.then(r => setChatList(r.data))
	}, [])

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

	function handleClickCreateChat(e: any) {
		if(!sideBarRef.current) return undefined
		if(!modalCreateWindowRef.current) return undefined

		console.log(jwtDecode((localStorage.getItem('token') as string)))

		const computedStylesSideBar = getComputedStyle(sideBarRef.current)
		sideBarRef.current.style.transform = `matrix(1, 0, 0, 1, -${computedStylesSideBar.width.slice(0, -2)}, 0)`

		modalCreateWindowRef.current.classList.add(cl['modalCreatechat-show'])
	}

	function handleClickCloseModal(e: any) {
		if(!modalCreateWindowRef.current) return undefined

		modalCreateWindowRef.current.classList.remove(cl['modalCreatechat-show'])

		const titleChat = document.querySelector<HTMLInputElement>('#titlechat')
		if(!titleChat) return undefined

		axios.post(serverLink("chats/create"), {
			userToken: localStorage.getItem('token'),
			title: titleChat.value
		})

		titleChat.value = ''
	}

	return (
	<>
		<div className={cl["chatscontent"]}>
			<div className={cl["chatscontent__chats"]}>
				<div className={cl["chatscontent__chats-manage"]}>
					<button onClick={handleClick}>
						<img src={fiolBurger} alt="burger" draggable={false}/>
					</button>
				</div>
				<div className={cl["chatscontent__chats-list"]}>{
					chatList.map((element) =>
						<div key={element.id} className={clsx(cl["chat_block"],cl["block"])}>
							<img src={vite} />
							<div className={cl["infocolumn"]}>
								<p className={cl["title"]}>{element.title}</p>
								<p className={cl["lastmessage"]}>hello world</p>
							</div>
						</div>
					)
				}</div>
				{(()=>{console.log(chatList); return null})()}
				<div className={cl["chatscontent__chats-sidebar"]} ref={sideBarRef}>
					<div className={cl["chatscontent__chats-sidebar-manage"]}>
						<button onClick={handleClickClose}>
							<img src={fiolBack} alt="back" draggable={false}/>
						</button>
						<span>{(jwtDecode((localStorage.getItem('token') as string)) as tokenPayload).nickname}</span>
						<div></div>
					</div>
					<div className={cl["chatscontent__chats-sidebar-actions"]}>
						<button onClick={handleClickCreateChat}>
							<span>Create chat</span>
						</button>
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
		<div className={cl['modalCreatechat']} ref={modalCreateWindowRef}>
			<div className={cl['modalCreatechat__title']}>
				<button onClick={handleClickCloseModal}>
					<img src={fiolBack} alt="burger" draggable={false}/>
				</button>
			</div>
			<div className={cl['modalCreatechat__inputs']}>
				<input type="text" placeholder="Title..." id="titlechat"/>
			</div>
			<div className={cl['modalCreatechat__createbutton']}>
				<button onClick={handleClickCloseModal}>
					<span>Create</span>
				</button>
			</div>
		</div>
	</>
	);
}
