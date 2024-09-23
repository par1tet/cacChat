import { userData } from '../../../shared/types/userData'
import cl from './SearchBlock.module.css'

type propsSearchBlock = {
    searchList: userData[],
    handleCreatePM: ((e: any)=>void) | ((e: any)=>void)
}

export const SearchBlock = ({searchList, handleCreatePM}: propsSearchBlock) => {

    if(searchList.length === 0) {
        return (<>
            <div className={cl["searchblock_notfound"]}>
                Ничего не найдено
            </div>
        </>)
    }else{
        return (<>
            <div className={cl["searchblock_list"]}>
                {searchList.map(user =>
                    <button
                        key={user.id}
                        className={cl["searchblock_list-button"]}
                        onClick={() => {
                            handleCreatePM(user);
                        }}
                    >
                        <p className={cl["searchblock_list-item"]}>
                            {user.nickname}
                        </p>
                    </button>
                )}
            </div>
        </>)
    }
}