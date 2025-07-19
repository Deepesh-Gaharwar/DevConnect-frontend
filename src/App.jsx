import React from "react"
import NavBar from "./components/NavBar"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Body from "./components/Body"
import Login from "./pages/Login"
import { Provider } from "react-redux"
import appStore from "./utils/appStore"
import Feed from "./pages/Feed"
import Profile from "./pages/Profile"

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

            </Route>
              
          </Routes>

        </BrowserRouter>
      
      </Provider>
    </>
  )
}

export default App;
