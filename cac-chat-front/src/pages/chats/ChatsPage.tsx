import axios from "axios";
import clsx from "clsx";
import { jwtDecode } from "jwt-decode";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverLink } from "../../shared/api/serverLink";
import { useStore } from "../../shared/hooks/useStore";
import { socket } from "../../shared/socket/socket";
import { rootStore } from "../../shared/store/rootStore";
import cl from "./ChatsPage.module.css";
import fiolBack from "/fiol_back.png";
import fiolBurger from "/fiol_burger.png";
import vite from "/vite.svg";
// import { toJS } from "mobx";
import { chat, message } from "../../shared/types/chats";
import { toJS } from "mobx";

type Props = {};

type tokenPayload = {
	email: string;
	id: number;
	nickname: string;
};

type userData = {
	email: string;
	exp: number;
	iat: number;
	id: number;
	nickname: string;
};

export const ChatsPage = observer(({}: Props) => {
	const myRootStore: rootStore = useStore();
	const navigate = useNavigate();
	const myUserData: userData = jwtDecode(localStorage.getItem("token") as any);

	const sideBarRef = useRef<HTMLDivElement>(null);
	const modalCreateWindowRef = useRef<HTMLDivElement>(null);
	const messageRef = useRef<HTMLDivElement>(null);

	const [searchList, setSearchList] = useState<userData[]>();

	useEffect(() => {
		if (!messageRef.current) return undefined;
		messageRef.current.scroll(0, 9999999999999999999999999999999999);
	});

	useEffect(() => {
		if (!messageRef.current) return undefined;
		messageRef.current.scroll(0, 9999999999999999999999999999999999);
	}, [myRootStore.chatsStore.chats]);

	useEffect(() => {
		if (!localStorage.getItem("token")) {
			navigate("/");
		} else {
			updateChatList();
			socket.connect();
		}
	}, []);

	useEffect(() => {
		socket.on("gettingMessage", (data) => {
			myRootStore.chatsStore.addMessageInChat(
				data.message.chatId,
				data.message
			);
		});
		socket.on("user", (data) => {
			if (myUserData.id == data) {
				updateChatList();
			}
		});

		return () => {
			socket.off("userIn");
			socket.off("gettingMessage");
		};
	}, [socket]);

	function updateChatList() {
		axios.post(serverLink("chats/list"), {
			userToken: localStorage.getItem("token"),
		})
		.then((r) => {
			myRootStore.chatsStore.setChats(r.data);
		});
	};

	function handleClick(e: any) {
		if (!sideBarRef.current) return undefined;
		sideBarRef.current.style.transform = "matrix(1, 0, 0, 1, 0, 0)";
	}

	function handleClickClose(e: any) {
		if (!sideBarRef.current) return undefined;

		console.log(jwtDecode(localStorage.getItem("token") as string));

		const computedStylesSideBar = getComputedStyle(sideBarRef.current);
		sideBarRef.current.style.transform = `matrix(1, 0, 0, 1, -${computedStylesSideBar.width.slice(
			0,
			-2
		)}, 0)`;
	}

	function handleClickCloseModal(e: any) {
		if (!sideBarRef.current) return undefined;
		if (!modalCreateWindowRef.current) return undefined;

		const computedStylesSideBar = getComputedStyle(sideBarRef.current);
		sideBarRef.current.style.transform = `matrix(1, 0, 0, 1, -${computedStylesSideBar.width.slice(
			0,
			-2
		)}, 0)`;

		modalCreateWindowRef.current.classList.toggle(cl["modalCreatechat-show"]);
	}

	function handleClickCreateChat(e: any) {
		if (!modalCreateWindowRef.current) return undefined;

		const titleChat = document.querySelector<HTMLInputElement>("#titlechat");

		if (!titleChat) return undefined;
		if (titleChat.value.trim() === '') {
			titleChat.value = "";
			return undefined
		}

		modalCreateWindowRef.current.classList.remove(cl["modalCreatechat-show"]);

		axios.post(serverLink("chats/create"), {
			userToken: localStorage.getItem("token"),
			title: titleChat.value,
		});
		myRootStore.chatsStore.createChat(titleChat.value)

		titleChat.value = "";
	}

	async function handleEnterMessage(e: any) {
		if (e.key === "Enter") {
			if (e.target.value.trim() === "") {
				return undefined;
			}

			await socket.emit("sendMessage", {
				content: e.target.value.trim(),
				userToken: localStorage.getItem("token"),
				chatId: myRootStore.chatsStore.currentChat,
			});

			myRootStore.chatsStore.addMessageInChat(
				myRootStore.chatsStore.currentChat,{
					content: e.target.value.trim(),
					userId: (jwtDecode(localStorage.getItem("token") as string) as any)
					.id,
				}
			);

			e.target.value = "";
		}
	}

	function handleChangeChat(e: any) {
		myRootStore.chatsStore.setCurrentChat(+e.currentTarget.attributes["data-chat-id"].value);

		console.log(toJS(myRootStore.chatsStore.chats))
		console.log(myRootStore.chatsStore.currentChat)
		console.log(myRootStore.chatsStore.chats[myRootStore.chatsStore.currentChat])
	}

	const handleSearchEnter = async (e: any) => {
		axios
			.post(serverLink("users/search_user"), {
				nickname: e.target.value,
				userId: myUserData.id,
			})
			.then((r) => {
				setSearchList(r.data);
		});
	};

	const handleBlur = () => {
		setTimeout(() => setSearchList(undefined), 300);
	};

  /* console.log(myRootStore.chatsStore.chats[2].messages[myRootStore.chatsStore.chats[2].messages.length - 1].content) */

	const handleSearchChat = async (element: any) => {
		let arr: any[] = [];

		if (myUserData.id != element.id) {
			await socket.emit("searchChatPrivate",[myUserData.id, element.id], (r: any) => {
				arr = r;

				if (arr.length == 0) {
					socket.emit("createChat",{
						title: element.nickname,
						userToken: localStorage.getItem("token"),
					}, async (r: any) => {
						updateChatList();
							socket.emit("addUserToChat", {
								userId: element.id,
								chatId: r.id,
							});
						}
					);
				}else{
					myRootStore.chatsStore.setCurrentChat(r[0].id);
				}
				}
			);
		}
	};

	return (
		<>
			<div className={cl["chatscontent"]}>
				<div className={cl["chatscontent__chats"]} onBlur={handleBlur}>
					<div className={cl["chatscontent__chats-manage"]}>
						<button onClick={handleClick}>
							<img src={fiolBurger} alt="burger" draggable={false} />
						</button>
						<input
							type="text"
							className={cl["chatscontent__chat-search"]}
							onChange={handleSearchEnter}
						/>
					</div>
					{searchList ? (
					<div className={cl["searchblock_list"]}>
						{searchList.map(element =>
							<button
								key={element.id}
								className={cl["searchblock_list-button"]}
								onClick={() => {
									handleSearchChat(element);
								}}
							>
								<p className={cl["searchblock_list-item"]}>
									{element.nickname}
								</p>
							</button>
						)}
					</div>
					) : (
					<div className={cl["chatscontent__chats-list"]}>
						{myRootStore.chatsStore.chats.map(chat =>
							<div
								key={chat.id}
								className={clsx(cl["chatblock"],cl["block"],
								cl[
									(() => {
									if (chat.id === myRootStore.chatsStore.currentChat) {
										return "chatblock-current";
									}
									return "";
									})()
								]
								)}
								data-chat-id={chat.id}
								onClick={handleChangeChat}
							>
								<img src={vite} />
								<div className={cl["infocolumn"]}>
								<p className={cl["title"]}>{chat.title}</p>
								<p className={cl["lastmessage"]}>
									{(
									()=>{
										if(chat.messages.length === 0){
											return null
										}
										return chat.messages[chat.messages.length - 1].content
									}
									)()}
								</p>
								</div>
							</div>
						)}
					</div>
					)}
					<div className={cl["chatscontent__chats-sidebar"]} ref={sideBarRef}>
						<div className={cl["chatscontent__chats-sidebar-manage"]}>
							<button onClick={handleClickClose}>
								<img src={fiolBack} alt="back" draggable={false} />
							</button>
							<span>{
								(jwtDecode(localStorage.getItem("token") as string) as tokenPayload).nickname
							}</span>

							<div></div>
						</div>
						<div className={cl["chatscontent__chats-sidebar-actions"]}>
							<button onClick={handleClickCloseModal}>
								<span>Create chat</span>
							</button>
						</div>
					</div>
				</div>
				<div className={cl["chatscontent__chatmessages"]}>
					<div className={cl["messages"]} ref={messageRef}>
						{myRootStore.chatsStore.currentChat !== -1 &&
							myRootStore.chatsStore.chats.find(chat =>
								chat.id === myRootStore.chatsStore.currentChat
							)?.messages.map((message, index) =>
								<div className="messagewrapper">
									<div
										className={clsx(
										cl[`message`],
										message.userId === myUserData.id
											? cl[`message-me`]
											: cl[`message-another`]
										)}
										key={index}
									>
										{message.content}
									</div>
								</div>
						)}
					</div>
					<div className={cl["inputmessage"]}>
					<input
						type="text"
						placeholder="Enter message..."
						onKeyDown={handleEnterMessage}
					/>
					</div>
				</div>
			</div>
			<div className={cl["modalCreatechat"]} ref={modalCreateWindowRef}>
				<div className={cl["modalCreatechat__title"]}>
					<button onClick={handleClickCloseModal}>
						<img src={fiolBack} alt="fiolback" draggable={false} />
					</button>
				</div>
				<div className={cl["modalCreatechat__inputs"]}>
					<input type="text" placeholder="Title..." id="titlechat" />
				</div>
				<div className={cl["modalCreatechat__createbutton"]}>
					<button onClick={handleClickCreateChat}>
						<span>Create</span>
					</button>
				</div>
			</div>
		</>
	);
});
