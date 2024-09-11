import { useState } from "react";
import PageHeader from "../../shared/PageHeader/PageHeader";
import "./SignUpPage.css";

type Props = {};

export default function SignUpPage({}: Props) {
  const pageTitle = "Sign up";

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

  const validateFields = (userData: UserData): boolean => {
    const { username, email, password, passwordVerify } = userData;
  
    if (!username.trim()) {
      console.log("Username is required.");
      return false;
    }
  
    if (!email.trim()) {
      console.log("Email is required.");
      return false;
    }
  
    if (!isValidEmail(email)) {
      console.log("Invalid email format.");
      return false;
    }
  
    if (password !== passwordVerify) {
      console.log("Passwords do not match.");
      return false;
    }
  
    if (password.length < 6) {
      console.log("Password must be at least 6 characters long.");
      return false;
    }
  
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
    <div className="sign_up_wrapper">
      <PageHeader title={pageTitle} />
      <div className="sign_up_form form">
        <div className="form_title_block">
          <p className="form_title">Create your account</p>
          <a href="#">or Sign in</a>
        </div>
        <input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Email" />
        <input type="text" name="username" value={userData.username} onChange={handleChange} placeholder="Username" />
        <input type="password" name="password" value={userData.password} onChange={handleChange} placeholder="Password" />
        <input type="password" name="passwordVerify" value={userData.passwordVerify} onChange={handleChange} placeholder="Password" />
        <button onClick={handleClick}>Enter</button>
        <a href="#">Google</a>
      </div>
    </div>
  );
}
