import { useDispatch } from "react-redux";
import { register, login, getMe } from "../services/auth.api.js";
import { setUser, setLoading, setError } from "../auth.slice.js";

export function useAuth() {
    const dispatch = useDispatch();
    async function handleRegister({ username, email, password }) {
        try {
            dispatch(setLoading(true))
            const response = await register({ username, email, password });
            return response
        } catch (error) {
            dispatch(setError(error.response.data.message))
            return error.response?.data || { 
            success: false, 
            message: 'Registration failed' 
        }
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true))
            const response = await login({ email, password });
            dispatch(setUser(response.user))
            return response
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "login failed"))
            return error.response?.data || { 
            success: false, 
            message: 'Login failed' 
        }
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true))
            const response = await getMe();
            dispatch(setUser(response.user))
        } catch (error) {
            dispatch(setError(error.response.data.message))
        } finally {
            dispatch(setLoading(false))
        }
    }
    return {
        handleRegister,
        handleLogin,
        handleGetMe
    }
}
