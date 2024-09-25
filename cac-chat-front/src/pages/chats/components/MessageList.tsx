import cl from './MessageList.module.css'
import { rootStore } from '../../../shared/store/rootStore'
import clsx from 'clsx'
import { forwardRef } from 'react'
import { userData } from '../../../shared/types/userData'
import { observer } from 'mobx-react-lite'
import { socket } from '../../../shared/socket/socket'

type propsMessageList = {
    store: rootStore,
    userData: userData
}

export const MessageList = observer(forwardRef(({store, userData}: propsMessageList, ref: React.Ref<HTMLDivElement>) => {
    // HANDLER FUNCTIONS

    async function handleEnterMessage(e: any) {
		/*
			Функция, которая срабатывает при отправлении сообщения.
			Работает при нажатии на Enter, когда выбрано поле ввода.
			Если строка пустая, то не срабатывает.
			Отправляет сообщение которое обрезано слева и справа пробелами
			через String.trim.
		*/
		if (e.key === "Enter") {
			if (e.target.value.trim() === "") {
				return undefined;
			}

			await socket.emit("sendMessage", {
				content: e.target.value.trim(),
				userToken: localStorage.getItem("token"),
				chatId: store.chatsStore.currentChat,
			});

			new Promise((res)=>{
                /* store.chatsStore.addMessageInChat(store.chatsStore.currentChat,{
					content: e.target.value.trim(),
					userId: userData
					.id,
				}) */

                res('end')
            })
            .then(() => {
                (ref as any).current.scroll(0,9999999999999999999999999999999999)
            })

			e.target.value = "";
		}
	}

    return (<>
        <div className={cl["chatscontent__chatmessages"]}>
            <div className={cl["messages"]} ref={ref}>
                {store.chatsStore.currentChat !== -1 &&
                    store.chatsStore.chats.find(chat =>
                        chat.id === store.chatsStore.currentChat
                    )?.messages.map((message, index) =>
                        <div
                            className={clsx(cl[`message`],
                            message.userId === userData.id
                                ? cl[`message-me`]
                                : cl[`message-another`]
                            )}
                            key={index}
                        >
                            {message.content}
                        </div>
                )}
            </div>
            <div className={cl["inputmessage"]}>
                <input
                    type="text"
                    placeholder="Enter message..."
                    onKeyDown={handleEnterMessage}
                    disabled={store.chatsStore.currentChat === -1}
                />
            </div>
        </div>
    </>)
}))