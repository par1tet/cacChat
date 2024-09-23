import fiolBack from '/fiol_back.png'
import cl from './ModalCreateChat.module.css'
import { forwardRef } from 'react'
import { rootStore } from '../../../../shared/store/rootStore'
import axios from 'axios'
import { serverLink } from '../../../../shared/api/serverLink'

type propsModalCreateChat = {
    store: rootStore,
    handleClickToggleModal: ((e:any)=>void) | ((e:any) => Promise<void>)
}

export const ModalCreateChat = forwardRef(({store, handleClickToggleModal}: propsModalCreateChat, modalCreateWindowRef: React.Ref<HTMLDivElement>) => {

    // HANDLE FUNCTIONS

	function handleClickCreateChat(e: any) {
		if (!(modalCreateWindowRef as any).current) return undefined;

		const titleChat = document.querySelector<HTMLInputElement>("#titlechat");

		if (!titleChat) return undefined;
		if (titleChat.value.trim() === '') {
			titleChat.value = "";
			return undefined
		}

		(modalCreateWindowRef as any).current.classList.remove(cl["modalCreatechat-show"]);

		axios.post(serverLink("chats/create"), {
			userToken: localStorage.getItem("token"),
			title: titleChat.value,
		});
		store.chatsStore.createChat(titleChat.value)

		titleChat.value = "";

		const computedStylesmodalCreateWindowRef = getComputedStyle((modalCreateWindowRef as any).current);

        if(computedStylesmodalCreateWindowRef.display === 'flex'){
			(modalCreateWindowRef as any).current.style.display = 'none'
		}else{
			(modalCreateWindowRef as any).current.style.display = 'flex'
		}
	}

    return (<>
        <div className={cl["modalCreatechat"]} ref={modalCreateWindowRef}>
            <div className={cl["modalCreatechat__title"]}>
                <button onClick={handleClickToggleModal}>
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
    </>)
})