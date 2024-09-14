import { useEffect, useState } from "react";
import cl from "./ChatsPage.module.css";
import mem from "/mem.png";
import vite from "/vite.svg";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
type Props = {};

export default function ChatsPage({}: Props) {
	const navigate = useNavigate()
	const [memViwe, setMemView] = useState(true);

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

	useEffect(() => {
		if(localStorage.getItem('token')){
			if (chatList.length > 5) {
				setMemView(false);
			}
			if (chatList.length <= 5) {
				setMemView(true);
			}
		}else{
			navigate('/')
		}
	}, [chatList]);

	const mapChatList = chatList.map((element) => (
		<div key={element.chatId} className={clsx(cl["chat_block"],cl["block"])}>
			<img src={element.img} />
			<div className={cl["block_column"]}>
				<p className={cl["title"]}>{element.title}</p>
				<p className={cl["last_message"]}>{element.lastMessage}</p>
			</div>
		</div>
	));

	return (
		<div className={cl["chats_wrapper"]}>
			<div className={cl["chats_container"]}>
				<div className={cl["chats_content"]}>{mapChatList}</div>
				{memViwe && (
					<div className={cl["mem"]}>
						<img src={mem} alt="" />
						<p>Тут ничего нет выбирай <br /> и проваливай</p>
					</div>
				)}
			</div>
		</div>
	);
}
