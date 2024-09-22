import { userData } from '../../../shared/types/userData'
import cl from './SearchBlock.module.css'

type propsSearchBlock = {
    searchList: userData[],
    handleSearchChat: ((e: any)=>void) | ((e: any)=>void)
}

export const SearchBlock = ({searchList, handleSearchChat}: propsSearchBlock) => {
    return (<>
        <div className={cl["searchblock_list"]}>
            {searchList.map(element =>
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
            )}
        </div>
    </>)
}