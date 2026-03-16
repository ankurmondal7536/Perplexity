import { createBrowserRouter } from 'react-router'
import Login from '../features/authentication/pages/Login'
import Register from '../features/authentication/pages/Register'
import Dashboard from '../features/chat/Dashboard'
import Protected from '../features/authentication/components/Protected'
import RegisterSuccess from '../features/authentication/pages/RegisterSucces'
export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/',
        element: <Protected>
            <Dashboard />
        </Protected>

    },
    {
        path: '/register-success',
        element: <RegisterSuccess />,
    }
])