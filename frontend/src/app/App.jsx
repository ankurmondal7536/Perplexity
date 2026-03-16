import { RouterProvider } from "react-router"
import { router } from "./app.routes"
import { useAuth } from "../features/authentication/hooks/useAuth"
import { useEffect } from "react"


function App() {

  // for user hydration on page load
  const auth = useAuth()
  useEffect(() => {
    auth.handleGetMe()
  },[])


  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
