import { useEffect, useState } from "react";
import PageHeader from "../../shared/PageHeader/PageHeader";
import "./ChatsPage.css";
import mem from "/mem.png";
import vite from "/vite.svg";
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
    <div key={element.chatId} className="chat_block block">
      <img className="img" src={element.img} />
      <div className="block_column">
        <p className="title">{element.title}</p>
        <p className="last_message">{element.lastMessage}</p>
      </div>
    </div>
  ));

  return (
    <div className="chats_wrapper">
      <PageHeader title={pageTitle} />
      <div className="chats_container">
        <div className="chats_content">{mapChatList}</div>
        {memViwe && (
          <div className="mem">
            <img src={mem} alt="" />
            <p>Тут ничего нет выбирай <br /> и проваливай</p>
          </div>
        )}
      </div>
    </div>
  );
}
