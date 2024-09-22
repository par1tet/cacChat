import cl from './MessageList.module.css'
import { rootStore } from '../../../shared/store/rootStore'
import clsx from 'clsx'
import { forwardRef } from 'react'
import { userData } from '../../../shared/types/userData'

type propsMessageList = {
    store: rootStore,
    userData: userData,
    handleEnterMessage: ((e:any)=>undefined) | ((e:any) => Promise<undefined>)
}

export const MessageList = forwardRef(({store, userData, handleEnterMessage}: propsMessageList, ref: React.Ref<HTMLDivElement>) => {
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
                    disabled={store.chatsStore.chats.find(chat =>
                        chat.id === store.chatsStore.currentChat
                    )?.messages.length ? false : true}
                />
            </div>
        </div>
    </>)
})