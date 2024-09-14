// import cl from './App.moudle.css';
import SignUpPage from '../../pages/sign-up/SignUpPage';
import SignInPage from '../../pages/sign-in/SignInPage';
import ChatsPage from '../../pages/chats/ChatsPage';
import TestPage from '../test-page/TestPage';
import { Routes, Route } from "react-router-dom";

function App() {
	return (
		<main>
			<Routes>
				<Route path='/' element={<TestPage />}></Route>
				<Route path='/chats' element={<ChatsPage />}></Route>
				<Route path='/sign_in' element={<SignInPage />}></Route>
				<Route path='/sign_up' element={<SignUpPage />}></Route>
			</Routes>
		</main>
	)
}

export default App
