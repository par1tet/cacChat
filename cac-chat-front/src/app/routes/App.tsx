// import cl from './App.moudle.css';
import SignUpPage from '../../pages/sign-up/SignUpPage';
import SignInPage from '../../pages/sign-in/SignInPage';
import ChatsPage from '../../pages/chats/ChatsPage';
import TestPage from '../test-page/TestPage';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <div>Ква Ква Ква</div>,
    children: [
      {
        path: "sign_up",
        element: <SignUpPage />,
      },
      {
        path: "sign_in",
        element: <SignInPage />,
      },
      {
        path: "chats",
        element: <ChatsPage />,
      },
      {
        path: "",
        element: <TestPage />,
      },
    ],
  },
])

function App() {
  
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
