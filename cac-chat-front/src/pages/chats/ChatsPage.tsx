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

  const [chatList, setChatList] = useState<chat[]>(myRootStore.chatsStore.chats);
  const [messageList, setMessageList] = useState<message[]>([]);
  const [searchList, setSearchList] = useState<userData[]>();

  useEffect(() => {
    if (!messageRef.current) return undefined;
    messageRef.current.scroll(0, 9999999999999999999999999999999999);
  });

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    } else {
      updateChatList();
      socket.connect();
    }
  }, []);

  const updateChatList = () => {
    axios
      .post(serverLink("chats/list"), {
        userToken: localStorage.getItem("token"),
      })
      .then((r) => {
        setChatList(r.data);
        console.log(r.data);
        myRootStore.chatsStore.setChats(r.data);
      });
  };

  useEffect(() => {
    if (!messageRef.current) return undefined;
    if (myRootStore.chatsStore.currentChat === -1) return undefined;
    const candidate = myRootStore.chatsStore.chats.filter(function (item) {
      return item.id === myRootStore.chatsStore.currentChat;
    })[0].messages;
    setMessageList(
      candidate
      /* myRootStore.chatsStore.chats[myRootStore.chatsStore.currentChat].messages */
    );
  }, [myRootStore.chatsStore.currentChat]);

  useEffect(() => {
    if (!messageRef.current) return undefined;
    messageRef.current.scroll(0, 9999999999999999999999999999999999);
  }, [myRootStore.chatsStore.chats]);

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

  function handleClickCreateChat(e: any) {
    if (!sideBarRef.current) return undefined;
    if (!modalCreateWindowRef.current) return undefined;

    console.log(jwtDecode(localStorage.getItem("token") as string));

    const computedStylesSideBar = getComputedStyle(sideBarRef.current);
    sideBarRef.current.style.transform = `matrix(1, 0, 0, 1, -${computedStylesSideBar.width.slice(
      0,
      -2
    )}, 0)`;

    modalCreateWindowRef.current.classList.add(cl["modalCreatechat-show"]);
  }

  function handleClickCloseModal(e: any) {
    if (!modalCreateWindowRef.current) return undefined;

    modalCreateWindowRef.current.classList.remove(cl["modalCreatechat-show"]);

    const titleChat = document.querySelector<HTMLInputElement>("#titlechat");
    if (!titleChat) return undefined;

    axios.post(serverLink("chats/create"), {
      userToken: localStorage.getItem("token"),
      title: titleChat.value,
    });

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
        myRootStore.chatsStore.currentChat,
        {
          content: e.target.value.trim(),
          userId: (jwtDecode(localStorage.getItem("token") as string) as any)
            .id,
        }
      );

      e.target.value = "";
    }
  }

  function handleChangeChat(e: any) {
    myRootStore.chatsStore.setCurrentChat(
      +e.currentTarget.attributes["data-chat-id"].value
    );
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
      await socket.emit(
        "searchChatPrivate",
        [myUserData.id, element.id],
        (r: any) => {
          console.log(r);
          arr = r;

          if (arr.length == 0) {
            socket.emit(
              "createChat",
              {
                title: element.nickname,
                userToken: localStorage.getItem("token"),
              },
              async (r: any) => {
                updateChatList();

                socket.emit("addUserToChat", {
                  userId: element.id,
                  chatId: r.id,
                });
              }
            );
          } else {
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
              {searchList.map((element, index) => (
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
              ))}
            </div>
          ) : (
            <div className={cl["chatscontent__chats-list"]}>
              {chatList.map((element) => (
                <div
                  key={element.id}
                  className={clsx(
                    cl["chatblock"],
                    cl["block"],
                    cl[
                      (() => {
                        if (element.id === myRootStore.chatsStore.currentChat) {
                          return "chatblock-current";
                        }
                        return "";
                      })()
                    ]
                  )}
                  /* по сути нада поменять на element.id */
                  data-chat-id={element.id}
                  onClick={handleChangeChat}
                >
                  <img src={vite} />
                  <div className={cl["infocolumn"]}>
                    <p className={cl["title"]}>{element.title}</p>
                    <p className={cl["lastmessage"]}>
                      {/* короче я пытался сделать здесь через mobx но он как то херово рендерит если обекта нету по этому нужно, либо добовлять значение в стейт chatList, либо в модель chats */}
                      {element.messages[element.messages.length - 1].content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className={cl["chatscontent__chats-sidebar"]} ref={sideBarRef}>
            <div className={cl["chatscontent__chats-sidebar-manage"]}>
              <button onClick={handleClickClose}>
                <img src={fiolBack} alt="back" draggable={false} />
              </button>
              <span>
                {
                  (
                    jwtDecode(
                      localStorage.getItem("token") as string
                    ) as tokenPayload
                  ).nickname
                }
              </span>
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
          {/* тут key нужен мб это как раз для оптимизации по рендеру  */}
          <div className={cl["messages"]} ref={messageRef}>
            {messageList.map((message, index) => (
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
            ))}
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
            <img src={fiolBack} alt="burger" draggable={false} />
          </button>
        </div>
        <div className={cl["modalCreatechat__inputs"]}>
          <input type="text" placeholder="Title..." id="titlechat" />
        </div>
        <div className={cl["modalCreatechat__createbutton"]}>
          <button onClick={handleClickCloseModal}>
            <span>Create</span>
          </button>
        </div>
      </div>
    </>
  );
});
