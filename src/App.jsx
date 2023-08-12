import { Feed, Create, Comments, Profile, Login, Loading, Profileform, Signin, Home } from "./components"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import PrivateRoutes from './utils/PrivateRoutes';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signin" element={<Signin/>}/>
      <Route element={<PrivateRoutes/>}>
        <Route path="/loading/:id" element={<Loading/>}/>
        <Route path='profileform/:id' element={<Profileform/>}/>
        <Route path="/feed" element={<Feed/>}/>
        <Route path="/create/:id" element={<Create/>}/>
        <Route path="/profile/:id" element={<Profile/>}/>
        <Route path="/comments/:id" element={<Comments/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
