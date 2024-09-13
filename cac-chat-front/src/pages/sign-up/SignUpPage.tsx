import { useRef, useState } from "react";
import PageHeader from "../../shared/PageHeader/PageHeader";
import cl from "./../../shared/css/Sign.module.css";
import clsx from "clsx";
import { Button } from "../../shared/UI-components/button/Button";

type Props = {};

export default function SignUpPage({}: Props) {
	const pageTitle = "Sign up";

	const errorTextRef = useRef<HTMLSpanElement>(null)

	interface UserData {
		username: string;
		email: string;
		password: string;
		passwordVerify: string;
	}

	const [userData, setUserData] = useState<UserData>({
		email: "",
		username: "",
		password: "",
		passwordVerify: ""
	})

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
		const { username, email, password, passwordVerify } = userData;
	
		if (!username.trim()) {
			addError("Username is required.")
			return false;
		}
	
		if (!email.trim()) {
			addError("Email is required.")
			return false;
		}
	
		if (!isValidEmail(email)) {
			addError("Invalid email format.")
			return false;
		}
	
		if (password !== passwordVerify) {
			addError("Passwords do not match.")
			return false;
		}
	
		if (password.length < 6) {
			addError("Password must be at least 6 characters long.")
			return false;
		}
		addError("")
		return true;
	};
	
	const isValidEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const handleClick = (): void => {
		if (validateFields(userData)) {
			console.log("Validation passed. Proceed with next steps.");
		} else {
			console.log("Validation failed.");
		}
	};

	return (
		<div className={cl["sign_wrapper"]}>
			<PageHeader title={pageTitle} />
			<div className={clsx(cl["sign_form"],cl["form"])}>
				<div className={cl["form_title_block"]}>
					<p className={cl["form_title"]}>Don't have an account? Sign up now.</p>
					<a href="/sign_in">or Sign in</a>
				</div>
				<input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Email" />
				<input type="text" name="username" value={userData.username} onChange={handleChange} placeholder="Username"/>
				<input type="password" name="password" value={userData.password} onChange={handleChange} placeholder="Password" />
				<input type="password" name="passwordVerify" value={userData.passwordVerify} onChange={handleChange} placeholder="Password" />
				<div className={cl['error']}>
					<span ref={errorTextRef}></span>
				</div>
				<Button width={200} height={40} onClick={handleClick}>
					Enter
				</Button>
				<a href="#">Google</a>
			</div>
		</div>
	);
}
