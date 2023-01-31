import React from "react"
import "./App.css"
import ContextMenu from "./components/ContextMenu/ContextMenu"
import Whiteboard from "./components/Whiteboard/Whiteboard"

function App() {
  return (
    <div>
      <Whiteboard />
      <ContextMenu />
    </div>
  )
}

export default App
