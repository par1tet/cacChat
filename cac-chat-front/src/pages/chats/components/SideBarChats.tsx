import cl from './SideBarChats.module.css'
import { userData } from '../../../shared/types/userData'
import fiolBack from '/fiol_back.png'
import { forwardRef } from 'react'

type action = {
    title: string,
    handleClickToggleModal: ((e: any)=>undefined) | ((e: any)=>Promise<undefined>)
}

type propsSideBarChats = {
    userData: userData,
    actions: action[]
}

export const SideBarChats = forwardRef(({userData, actions}: propsSideBarChats, sideBarRef: React.Ref<HTMLDivElement>) => {
    // HANDLER FUNCTIONS

	function handleClickClose() {
		if (!sideBarRef) return undefined;
		if (!(sideBarRef as any).current) return undefined;

		const computedStylesSideBar = getComputedStyle((sideBarRef as any).current);
		(sideBarRef as any).current.style.transform = `matrix(1, 0, 0, 1, -${computedStylesSideBar.width.slice(
			0,
			-2
		)}, 0)`;
	}

    return (<>
        <div className={cl["chatscontent__chats-sidebar"]} ref={sideBarRef}>
            <div className={cl["chatscontent__chats-sidebar-manage"]}>
                <button onClick={handleClickClose}>
                    <img src={fiolBack} alt="back" draggable={false} />
                </button>
                <span>{
                    userData.nickname
                }</span>

                <div></div>
            </div>
            {actions.map((action, index) =>
                <div className={cl["chatscontent__chats-sidebar-actions"]} key={index}>
                    <button onClick={action.handleClickToggleModal}>
                        <span>{action.title}</span>
                    </button>
                </div>
            )}
        </div>
    </>)
})