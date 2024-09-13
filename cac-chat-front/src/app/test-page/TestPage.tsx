import { useState } from "react"
import cl from "./TestPage.module.css"

type Props = {}

export default function TestPage({}: Props) {
	const [token] = useState(localStorage.getItem('token'))

	console.log(localStorage.getItem('token'))
	
	if(token){
		return (
			<ul className={cl['test_page_list']}>
				<a href="/chats">chats</a>
			</ul>
		)
	}else{
		return (
			<ul className={cl['test_page_list']}>
				<a href="/sign_up">sign_up</a>
				<a href="/sign_in">sign_in</a>
			</ul>
		)
	}
}