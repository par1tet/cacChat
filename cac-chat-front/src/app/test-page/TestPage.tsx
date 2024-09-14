import { useEffect } from "react"
import cl from "./TestPage.module.css"
import { Link, useNavigate } from "react-router-dom"

type Props = {}

export default function TestPage({}: Props) {
	const navigate = useNavigate()

	useEffect(() => {
		if(localStorage.getItem('token')){
			navigate('/chats')
		}
	}, [])
	
	if(!localStorage.getItem('token')){
		return (
			<ul className={cl['test_page_list']}>
				<Link to="/sign_up">sign_up</Link>
				<Link to="/sign_in">sign_in</Link>
			</ul>
		)
	}
}