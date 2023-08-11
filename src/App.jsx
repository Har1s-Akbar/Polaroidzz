import { Feed, Create, Comments, Profile, Login, Loading, Profileform } from "./components"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import PrivateRoutes from './utils/PrivateRoutes';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route element={<PrivateRoutes/>}>
        <Route path="/loading/:id" element={<Loading/>}/>
        <Route path='profileform/:id' element={<Profileform/>}/>
        <Route path="/feed" element={<Feed/>}/>
        <Route path="/create" element={<Create/>}/>
        <Route path="/comments" element={<Comments/>}/>
        <Route path="/profile/:id" element={<Profile/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
