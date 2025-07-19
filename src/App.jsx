import React from "react"
import NavBar from "./components/NavBar"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Body from "./components/Body"
import Login from "./pages/Login"
import { Provider } from "react-redux"
import appStore from "./utils/appStore"
import Feed from "./pages/Feed"
import Profile from "./pages/Profile"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import Connections from "./pages/Connections"

function App() {

  return (
    <> 
      <Provider store = {appStore} >

        <BrowserRouter basename="/">

          <Routes>

            <Route path="/" element = {<Body/>}> 
                
                <Route path="/" element = {<Feed/>}/>
                <Route path="/login" element = {<Login/>}/>
                <Route path="/profile" element = {<Profile/>}/>
                <Route path="/connections" element = {<Connections/>}/>
                <Route path="/requests" element = {<Profile/>}/>

            </Route>
              
          </Routes>

        </BrowserRouter>

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
