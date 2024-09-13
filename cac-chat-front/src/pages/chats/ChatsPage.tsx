import { useEffect, useState } from "react";
import PageHeader from "../../shared/PageHeader/PageHeader";
import cl from "./ChatsPage.module.css";
import mem from "/mem.png";
import vite from "/vite.svg";
import clsx from "clsx";
type Props = {};

export default function ChatsPage({}: Props) {
  const pageTitle = "Chats";
  const [memViwe, setMemView] = useState(true);

  const chatList = [
    {
      title: "hello",
      img: vite,
      lastMessage: "hello, world",
      chatId: 2,
    },
    {
      title: "hello",
      img: vite,
      lastMessage: "hello, world",
      chatId: 2,
    },
    {
      title: "hello",
      img: vite,
      lastMessage: "hello, world",
      chatId: 2,
    },
  ];

  useEffect(() => {
    if (chatList.length > 5) {
      setMemView(false);
    }
    if (chatList.length <= 5) {
      setMemView(true);
    }
  }, [chatList]);

  const mapChatList = chatList.map((element, index) => (
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
      <PageHeader title={pageTitle} />
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
