// import cl from './App.moudle.css';
import { Route, Routes } from "react-router-dom";
import ChatsPage from '../../pages/chats/ChatsPage.tsx';
import SignInPage from '../../pages/sign-in/SignInPage.tsx';
import SignUpPage from '../../pages/sign-up/SignUpPage.tsx';
import MainPage from '../test-page/MainPage.tsx';
import PageHeader from "../../shared/PageHeader/PageHeader.tsx";

function App() {
	return (
		<>
			{/* <PageHeader title={'hi'} /> */}
			<main>
				<Routes>
					<Route path='/' element={<MainPage />}></Route>
					<Route path='/chats' element={<ChatsPage />}></Route>
					<Route path='/sign_in' element={<SignInPage />}></Route>
					<Route path='/sign_up' element={<SignUpPage />}></Route>
				</Routes>
			</main>
		</>
	)
}

export default App
