import { ChangeEvent, useRef, useState } from "react";
import PageHeader from "../../shared/PageHeader/PageHeader";
import cl from "./../../shared/css/Sign.module.css";
import clsx from "clsx";
import { Button } from "../../shared/UI-components/button/Button";

type Props = {};

export default function SignInPage({}: Props) {
	const pageTitle = "Sign In";
	interface UserData {
		userID: string;
		password: string;
	}
	const [userData, setUserData] = useState<UserData>({
		userID: "",
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
		const { userID, password } = userData;

		if (!userID.trim()) {
			addError("Username is required.");
			return false;
		}

		if (password.length < 6) {
			addError("Password must be at least 6 characters long.");
			return false;
		}

		return true;
	};

	const handleClick = (): void => {
		if (validateFields(userData)) {
			console.log("Validation passed. Proceed with next steps.");
		}else{
			console.log("Validation failed.");
		}
	};

	return (
		<div className={cl["sign_wrapper"]}>
			<PageHeader title={pageTitle} />
			<div className={clsx(cl["sign_form"],cl["form"])}>
				<div className={cl["form_title_block"]}>
					<p className={cl["form_title"]}>Welcome back! Please sign in.</p>
					<a href="/sign_up">or Sign up</a>
				</div>
				<input type="text" name="userID" value={userData.userID} onChange={handleChange} placeholder="Username" />
				<input type="password" name="password" value={userData.password} onChange={handleChange} placeholder="Password" />
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
