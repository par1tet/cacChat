import './App.css';
import SignUpPage from '../../pages/sign-up/SignUpPage';
import SignInPage from '../../pages/sign-in/SignInPage';
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
