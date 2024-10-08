import { useRef, useState } from "react";
import cl from "./../../shared/css/Sign.module.css";
import clsx from "clsx";
import { Button } from "../../shared/UI-components/button/Button";
import axios from "axios";
import { serverLink } from "../../shared/api/serverLink";
import { Link, useNavigate } from "react-router-dom";

type Props = {};

export default function SignInPage({}: Props) {
	const navigate = useNavigate()
	interface UserData {
		email: string;
		password: string;
	}
	const [userData, setUserData] = useState<UserData>({
		email: "",
		password: "",
	})

	const errorTextRef = useRef<HTMLSpanElement>(null)

	const handleChange = (e: any) => {
		const {name, value} = e.target;
		setUserData((prevData) => ({
			...prevData,
			[name]: value
		}))
	}

	function addError(errorName: string) {
		if(errorTextRef.current)
		errorTextRef.current.innerHTML = errorName
	}

	const validateFields = (userData: UserData): boolean => {
		const { email, password } = userData;

		if (!email.trim()) {
			addError("Email is required.")
			return false;
		}
	
		if (!isValidEmail(email)) {
			addError("Invalid email format.")
			return false;
		}

		if (password.length < 6) {
			addError("Password must be at least 6 characters long.");
			return false;
		}

		return true;
	};

	const isValidEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const handleClick = async () => {
		if (validateFields(userData)) {
			await axios.post(serverLink('auth/login'), {
				email: userData.email,
				password: userData.password,
			})
			.then(r => localStorage.setItem('token', r.data.token))

			navigate('/chats')
		}else{
			console.log("Validation failed.");
		}
	};

	return (
		<div className={clsx(cl["sign_form"],cl["form"])}>
			<div className={cl["form_title_block"]}>
				<p className={cl["form_title"]}>Welcome back! Please sign in.</p>
				<Link to="/sign_up">or Sign up</Link>
			</div>
			<input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Email"/>
			<input type="password" name="password" value={userData.password} onChange={handleChange} placeholder="Password" />
			<div className={cl['error']}>
				<span ref={errorTextRef}></span>
			</div>
			<Button width={200} height={40} onClick={handleClick}>
				Enter
			</Button>
		</div>
	);
}
