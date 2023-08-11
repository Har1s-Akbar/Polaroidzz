import { Feed, Create, Comments, Profile, Login } from "./components"
import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/feed" element={<Feed/>}/>
      <Route path="/create" element={<Create/>}/>
      <Route path="/comments" element={<Comments/>}/>
      <Route path="/profile" element={<Profile/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
