import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import cl from "./MainPage.module.css"

type Props = {}

export default function MainPage({}: Props) {
	const navigate = useNavigate()

	useEffect(() => {
		if(localStorage.getItem('token')){
			navigate('/chats')
		}
	}, [])
	
	if(!localStorage.getItem('token')){
		return (
			<div className={cl['mainpage']}>
				<div className={cl['mainpage__list']}>
					<Link to="/sign_up">Sign up</Link>
					<Link to="/sign_in">Sign in</Link>
				</div>
			</div>
		)
	}
}