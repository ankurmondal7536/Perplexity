import { createBrowserRouter } from 'react-router'
import Login from '../features/authentication/pages/Login'
import Register from '../features/authentication/pages/Register'
import Dashboard from '../features/chat/Dashboard'
import Protected from '../features/authentication/components/Protected'
import RegisterSuccess from '../features/authentication/pages/RegisterSucces'
import { Navigate } from 'react-router'
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
    },
    {
        path: '*', // all other routes will redirect to the home page
        element: <Navigate to="/" replace />
    }
])