import React from "react"
import NavBar from "./components/NavBar"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Body from "./components/Body"

function App() {

  return (
    <> 
      
      <BrowserRouter basename="/">

         <Routes>

            <Route path="/" element = { <Body/> }> 
            
            
            
            </Route>
             
         </Routes>

      </BrowserRouter>

    </>
  )
}

export default App
