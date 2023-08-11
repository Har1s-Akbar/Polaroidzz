import { Feed, Create, Comments, Profile, Login, Loading, Profileform, Signin } from "./components"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import PrivateRoutes from './utils/PrivateRoutes';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signin" element={<Signin/>}/>
        <Route path="/loading/:id" element={<Loading/>}/>
        <Route path='profileform/:id' element={<Profileform/>}/>
      {/* <Route element={<PrivateRoutes/>}> */}
        <Route path="/feed" element={<Feed/>}/>
        <Route path="/create/:id" element={<Create/>}/>
        <Route path="/comments/:id" element={<Comments/>}/>
        <Route path="/profile/:id" element={<Profile/>}/>
      {/* </Route> */}
    </Routes>
    </BrowserRouter>
  )
}

export default App
