import { useEffect, useState } from "react";
import cl from "./ChatsPage.module.css";
import vite from "/vite.svg";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import fiolBurger from '/fiol_burger.png'
import fiolBack from '/fiol_back.png'
import { useRef } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { serverLink } from "../../shared/api/serverLink";
import { socket } from "../../shared/socket/socket";
import { observer } from "mobx-react-lite";
import { useStore } from "../../shared/hooks/useStore";
import { rootStore } from "../../shared/store/rootStore";
// import { toJS } from "mobx";
import { chat } from "../../shared/types/chats";
import { message } from "../../shared/types/chats";

type Props = {};

type tokenPayload = {
	email: string,
	id: number,
	nickname: string
}

export const ChatsPage = observer(({}: Props) => {
	const myRootStore: rootStore = useStore()
	const navigate = useNavigate()

	const sideBarRef = useRef<HTMLDivElement>(null)
	const modalCreateWindowRef = useRef<HTMLDivElement>(null)
	const messageWrapperRef = useRef<HTMLDivElement>(null)
	const messageRef = useRef<HTMLDivElement>(null)

	const [chatList, setChatList] = useState<chat[]>(myRootStore.chatsStore.chats)
	const [messageList, setMessageList] = useState<message[]>([])

	useEffect(() => {
		if(!messageRef.current) return undefined
		messageRef.current.scroll(0,9999999999999999999999999999999999)
	})

	useEffect(() => {
		if(!localStorage.getItem('token')){
			navigate('/')
		}else{
			axios.post(serverLink('chats/list'), {
				userToken: localStorage.getItem('token')
			})
			.then(r => setChatList(r.data))
	
			axios.post(serverLink('chats/get_chats_with_messages_for_user'), {
				userToken: localStorage.getItem('token')
			})
			.then(r => {
				console.log(r.data)
				myRootStore.chatsStore.setChats(r.data)
			})

			socket.connect()
		}
	}, [])

	useEffect(() => {
		if(!messageRef.current) return undefined
		if(myRootStore.chatsStore.currentChat === -1) return undefined
		setMessageList(myRootStore.chatsStore.chats[myRootStore.chatsStore.currentChat].messages)
	}, [myRootStore.chatsStore.currentChat])
	
	useEffect(() => {
		if(!messageRef.current) return undefined
		messageRef.current.scroll(0,9999999999999999999999999999999999)
		console.log('handle')
	}, [myRootStore.chatsStore.chats])

	useEffect(() => {
		socket.on('gettingMessage', data => {
			myRootStore.chatsStore.addMessageInChat((data.chatId-1), data.message)
		})

		return ()=>{socket.off('gettingMessage')}
	}, [socket])

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

	async function handleEnterMessage(e: any){
		if(e.key === 'Enter'){
			console.log(e.target.value)

			if(e.target.value.trim() === ''){
				return undefined
			}

			await socket.emit('sendMessage', {
				content: e.target.value.trim(),
				userToken: localStorage.getItem('token'),
				chatId: myRootStore.chatsStore.currentChat+1
			})

			myRootStore.chatsStore.addMessageInChat((myRootStore.chatsStore.currentChat), {
				content: e.target.value.trim(),
				userId: (jwtDecode(localStorage.getItem('token') as string) as any).id
			}, ()=> {
				if(!messageRef.current) return undefined
				messageRef.current.scroll(0,9999999999999999999999999999999999)
				console.log('rwaset')
			})

			e.target.value = ''
		}
	}

	function handleChangeChat(e: any){
		myRootStore.chatsStore.setCurrentChat(+e.currentTarget.attributes['data-chat-id'].value)
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
					chatList.map((element, index) =>
						<div
							key={index}
							className={clsx(cl["chatblock"],cl["block"], cl[(()=>{
								if(index === myRootStore.chatsStore.currentChat){
									return 'chatblock-current'
								}
								return ''
							})()])}
							data-chat-id={index}
							onClick={handleChangeChat}
						>
							<img src={vite} />
							<div className={cl["infocolumn"]}>
								<p className={cl["title"]}>{element.title}</p>
								<p className={cl["lastmessage"]}>hello world</p>
							</div>
						</div>
					)
				}</div>
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
				{/* <div className={cl['messageswrapper']} ref={messageWrapperRef}> */}
					<div className={cl['messages']} ref={messageRef}>
						{messageList.map((message, index) =>
							<div
								className={clsx(cl[`messagewrapper`],
								cl[`messagewrapper-${'me'}`])}
								key={index}						>
								<span>{message.content}</span>
							</div>
						)}
					</div>
				{/* </div> */}
				<div className={cl['inputmessage']}>
					<input type="text" placeholder="Enter message..." onKeyDown={handleEnterMessage}/>
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
})
