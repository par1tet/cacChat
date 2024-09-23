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
// import { chat, message } from "../../shared/types/chats"
import { MessageList } from "./components/MessageList";
import { SideBarChats } from "./components/SideBarChats";
import { SearchBlock } from "./components/SearchBlock";
import { ChatsBlock } from "./components/ChatsBlock";
import { ModalCreateChat } from "./components/Modals/ModalCreateChat";

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

	// USE EFFECTS

	useEffect(() => {
		if (!messageRef.current) return undefined;
		messageRef.current.scroll(0, 9999999999999999999999999999999999);
	}, [myRootStore.chatsStore.currentChat]);

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

	// FUNCTIONS

	function updateChatList() {
		axios.post(serverLink("chats/list"), {
			userToken: localStorage.getItem("token"),
		})
		.then((r) => {
			myRootStore.chatsStore.setChats(r.data);
		});
	};

	// HANDLER FUNCTIONS

	const handleSearchChat = async (e: any) => {
		/*
			Функция которая ищет пользователей
		*/
		let arr: any[] = [];

		if (myUserData.id != e.id) {
			await socket.emit("searchChatPrivate",[myUserData.id, e.id], (r: any) => {
				arr = r;

				if (arr.length == 0) {
					socket.emit("createChat",{
						title: e.nickname,
						userToken: localStorage.getItem("token"),
					}, async (r: any) => {
						updateChatList();
							socket.emit("addUserToChat", {
								userId: e.id,
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

	function handleClickToggleModal(e: any) {
		if (!sideBarRef.current) return undefined;
		if (!modalCreateWindowRef.current) return undefined;

		const computedStylesSideBar = getComputedStyle(sideBarRef.current);
		sideBarRef.current.style.transform = `matrix(1, 0, 0, 1, -${computedStylesSideBar.width.slice(
			0,
			-2
		)}, 0)`;

		const computedStylesmodalCreateWindowRef = getComputedStyle(modalCreateWindowRef.current);

		if(computedStylesmodalCreateWindowRef.display === 'flex'){
			modalCreateWindowRef.current.style.display = 'none'
		}else{
			modalCreateWindowRef.current.style.display = 'flex'
		}
	}

	function handleChangeChat(e: any) {
		myRootStore.chatsStore.setCurrentChat(+e.currentTarget.attributes["data-chat-id"].value);
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
		setSearchList(undefined)
	};

	function handleClick(e: any) {
		if (!sideBarRef.current) return undefined;
		sideBarRef.current.style.transform = "matrix(1, 0, 0, 1, 0, 0)";
	}

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
						<SearchBlock
							searchList={searchList}
							handleSearchChat={handleSearchChat}
						/>
					) : (
						<ChatsBlock
							store={myRootStore}
							handleChangeChat={handleChangeChat}
						/>
					)}
					<SideBarChats
						actions={[
							{
								title: 'Create chat',
								handleClickToggleModal: handleClickToggleModal
							}
						]}
						userData={myUserData}
						ref={sideBarRef}
					></SideBarChats>
				</div>
				<MessageList
					ref={messageRef}
					store={myRootStore}
					userData={myUserData}
				></MessageList>
			</div>
			<ModalCreateChat
				store={myRootStore}
				handleClickToggleModal={handleClickToggleModal}
				ref={modalCreateWindowRef}
			/>
		</>
	);
});
