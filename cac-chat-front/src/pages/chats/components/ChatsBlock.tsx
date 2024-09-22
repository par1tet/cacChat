import cl from './ChatsBlock.module.css'
import { rootStore } from '../../../shared/store/rootStore'
import vite from "/vite.svg";
import clsx from 'clsx';
import { chat } from '../../../shared/types/chats';
import { observer } from 'mobx-react-lite';

type propsChatsBlock = {
    store: rootStore,
    handleChangeChat: ((e:any)=>void) | ((e:any) => Promise<void>)
}

export const ChatsBlock = observer(({store, handleChangeChat}: propsChatsBlock) => {
    return (<>
        <div className={cl["chatscontent__chats-list"]}>
            {store.chatsStore.chats.map(chat =>
                <div
                    key={chat.id}
                    className={clsx(cl["chatblock"],cl["block"],
                    cl[
                        (() => {
                        if (chat.id === store.chatsStore.currentChat) {
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
                    <div className={cl["title"]}>
                        <span>
                            {chat.title}
                        </span>
                    </div>
                    <p className={cl["lastmessage"]}>
                        {(()=>{
                            if(chat.messages.length === 0){
                                return null
                            }
                            return chat.messages[chat.messages.length - 1].content
                        })()}
                    </p>
                    </div>
                </div>
            )}
        </div>
    </>)
})