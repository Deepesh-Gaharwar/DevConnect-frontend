import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Body from "./components/Body"
import Login from "./pages/Login"
import { Provider } from "react-redux"
import appStore, { persistor } from "./utils/appStore"
import Feed from "./pages/Feed"
import Profile from "./pages/Profile"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import Connections from "./pages/Connections"
import Requests from "./pages/Requests"
import ForgotPassword from "./pages/ForgotPassword"
import { PersistGate } from "redux-persist/integration/react"
import { Loader } from "lucide-react"
import Premium from "./pages/Premium"

function App() {

  return (
    <> 
      <Provider store = {appStore} >
      
      {/* Added a loader so that redux store is rehydrate , then it loads the component  */}
        <PersistGate 
              loading={
                <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
                  <Loader className="w-12 h-12 text-primary animate-spin" />
                  <p className="mt-4 text-sm text-gray-500">Loading your experience...</p>
                </div>
              }

            persistor={persistor}
        >

              <BrowserRouter basename="/">

                <Routes>

                  <Route path="/" element = {<Body/>}> 
                      
                      <Route path="/" element = {<Feed/>}/>
                      
                      <Route path="/profile" element = {<Profile/>}/>
                      <Route path="/connections" element = {<Connections/>}/>
                      <Route path="/requests" element = {<Requests/>}/>
                      <Route path="/forgot-password" element = {<ForgotPassword/>}/>
                      <Route path="/premium" element = {<Premium/>}/>
                    
                      <Route path="/login" element = {<Login/>}/>

                  </Route>
                    
                </Routes>

            </BrowserRouter>

        </PersistGate>

        {/*  ToastContainer  */}
        <ToastContainer 
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        /> 
      
      </Provider>
    </>
  )
}

export default App;
