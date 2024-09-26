import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serverLink } from '../../shared/api/serverLink';
import { useStore } from '../../shared/hooks/useStore';
import { socket } from '../../shared/socket/socket';
import { rootStore } from '../../shared/store/rootStore';
import cl from './ChatsPage.module.css';
import fiolBurger from '/fiol_burger.png';
import { MessageList } from './components/MessageList';
import { SideBarChats } from './components/SideBarChats';
import { SearchBlock } from './components/SearchBlock';
import { ChatsBlock } from './components/ChatsBlock';
import { ModalCreateChat } from './components/Modals/ModalCreateChat';
import { chat } from '../../shared/types/chats';

type userData = {
    email: string;
    exp: number;
    iat: number;
    id: number;
    nickname: string;
};

export const ChatsPage = observer(({}) => {
    const myRootStore: rootStore = useStore();
    const navigate = useNavigate();
    const myUserData: userData = jwtDecode(
        localStorage.getItem('token') as any,
    );

    const sideBarRef = useRef<HTMLDivElement>(null);
    const modalCreateWindowRef = useRef<HTMLDivElement>(null);
    const messageRef = useRef<HTMLDivElement>(null);

    const [searchList, setSearchList] = useState<userData[]>([]);
    const [isSearch, setIsSearch] = useState<boolean>(false);

    // USE EFFECTS

    useEffect(() => {
        if (!messageRef.current) return undefined;
        messageRef.current.scroll(0, 9999999999999999999999999999999999);
    }, [myRootStore.chatsStore.currentChat]);

    useEffect(() => {
        console.log('useEffect вызван');
        if (!localStorage.getItem('token')) {
            navigate('/');
        } else {
            updateChatList();
            
            socket.emit('connectUser', { userId: myUserData.id });
            
            myRootStore.chatsStore.chats.forEach((chat) => {
                socket.emit('joinChat', { chatId: chat.id });
            });
        }
    }, []);
    

    useEffect(() => {
        socket.on('message', (data: any) => {
            console.log(data)
            const chatId = data.chatId;
            myRootStore.chatsStore.addMessageInChat(chatId, data);
        });
        
        socket.on('chatInvite', (data: any) => {
            socket.emit('joinChat', { chatId: data.id});
            myRootStore.chatsStore.createChat(data, myUserData.nickname)
        });

        return () => {
            socket.off('message');
            socket.off('chatInvite');
        };
    }, [socket]);

    // FUNCTIONS

    function updateChatList() {
        axios
            .post(serverLink('chats/list'), {
                userToken: localStorage.getItem('token'),
            })
            .then((r) => {
                console.log("connectData")
                r.data.forEach((chat: chat) => {
                    myRootStore.chatsStore.createChat(chat, myUserData.nickname);
                    socket.emit('joinChat', { chatId: chat.id });
                });
            });
    }

    // HANDLER FUNCTIONS

    const handleCreatePM = async (user: userData) => {
        await socket.emit("createPrivateChat", {
            userToken: localStorage.getItem('token'),
            users: [user.id, myUserData.id]
        }, (r:any) => {
            if(typeof r == "number"){
                myRootStore.chatsStore.setCurrentChat(r)
            }
            else{
                console.log("create new chat")
            }
        });

        setIsSearch(false);
        setSearchList([]);
    };

    function handleClickToggleModal(e: any) {
        if (!sideBarRef.current) return undefined;
        if (!modalCreateWindowRef.current) return undefined;

        const computedStylesSideBar = getComputedStyle(sideBarRef.current);
        sideBarRef.current.style.transform = `matrix(1, 0, 0, 1,
											-${computedStylesSideBar.width.slice(0, -2)}, 0)`;

        const computedStylesmodalCreateWindowRef = getComputedStyle(
            modalCreateWindowRef.current,
        );

        if (computedStylesmodalCreateWindowRef.display === 'flex') {
            modalCreateWindowRef.current.style.display = 'none';
        } else {
            modalCreateWindowRef.current.style.display = 'flex';
        }
    }

    function handleSearchFocus(e: any) {
        setIsSearch(true);

        if (e.target.value === '') {
            return setSearchList([]);
        }

        axios
            .post(serverLink('users/search_user'), {
                nickname: e.target.value,
                userId: myUserData.id,
            })
            .then((r) => {
                setSearchList(r.data);
            });
    }

    async function handleSearchEnter(e: any) {
        setIsSearch(true);

        if (e.target.value === '') {
            return setSearchList([]);
        }

        axios
            .post(serverLink('users/search_user'), {
                nickname: e.target.value,
                userId: myUserData.id,
            })
            .then((r) => {
                setSearchList(r.data);
            });
    }

    function handleSearchBlur() {
        setTimeout(() => {
            setSearchList([]);
            setIsSearch(false);
        }, 300)
    }

    function handleOpenSideBar(e: any) {
        if (!sideBarRef.current) return undefined;
        sideBarRef.current.style.transform = 'matrix(1, 0, 0, 1, 0, 0)';
    }

    return (
        <>
            <div className={cl['chatscontent']}>
                <div className={cl['chatscontent__chats']}>
                    <div className={cl['chatscontent__chats-manage']}>
                        <button onClick={handleOpenSideBar}>
                            <img
                                src={fiolBurger}
                                alt="burger"
                                draggable={false}
                            />
                        </button>
                        <input
                            type="text"
                            className={cl['chatscontent__chat-search']}
                            onChange={handleSearchEnter}
                            onBlur={handleSearchBlur}
                            onFocus={handleSearchFocus}
                        />
                    </div>
                    {searchList.length !== 0 || isSearch ? (
                        <SearchBlock
                            searchList={searchList}
                            handleCreatePM={(user) => handleCreatePM(user)}
                        />
                    ) : (
                        <ChatsBlock store={myRootStore} />
                    )}
                    <SideBarChats
                        actions={[
                            {
                                title: 'Create chat',
                                handleClickToggleModal: handleClickToggleModal,
                            },
                        ]}
                        userData={myUserData}
                        ref={sideBarRef}
                    ></SideBarChats>
                </div>
                <MessageList
                    ref={messageRef}
                    store={myRootStore}
                    userData={myUserData}
                ></MessageList>
            </div>
            <ModalCreateChat
                store={myRootStore}
                handleClickToggleModal={handleClickToggleModal}
                ref={modalCreateWindowRef}
            />
        </>
    );
});
