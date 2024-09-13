import { useState } from "react";
import PageHeader from "../../shared/PageHeader/PageHeader";
import cl from "./SignInPage.module.css";
import clsx from "clsx";

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

  const handleChange = (e: any) => {
    const {name, value} = e.target;
    setUserData((prevData) => ({
        ...prevData,
        [name]: value
    }))
  }

  const validateFields = (userData: UserData): boolean => {
    const { userID, password } = userData;
  
    if (!userID.trim()) {
      console.log("Username is required.");
      return false;
    }
  
    if (password.length < 6) {
      console.log("Password must be at least 6 characters long.");
      return false;
    }
  
    return true;
  };

  const handleClick = (): void => {
    if (validateFields(userData)) {
      console.log("Validation passed. Proceed with next steps.");
    } else {
      console.log("Validation failed.");
    }
  };

  return (
    <div className={cl["sign_in_wrapper"]}>
      <PageHeader title={pageTitle} />
      <div className={clsx(cl["sign_in_form"],cl["form"])}>
        <div className={cl["form_title_block"]}>
          <p className={cl["form_title"]}>Welcome back! Please sign in.</p>
          <a href="/sign_up">or Sign up</a>
        </div>
        <input type="text" name="userID" value={userData.userID} onChange={handleChange} placeholder="Username" />
        <input type="password" name="password" value={userData.password} onChange={handleChange} placeholder="Password" />
        <button onClick={handleClick}>Enter</button>
        <a href="#">Google</a>
      </div>
    </div>
  );
}
