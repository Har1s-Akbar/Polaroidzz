import React, { useState } from 'react';
import {auth, provider} from './firebaseConfig';
import {signInWithPopup, createUserWithEmailAndPassword} from 'firebase/auth';
import {useDispatch} from 'react-redux';
import { AuthFail, AuthSuccess, setUser } from '../store/slice';
import { useNavigate} from 'react-router-dom';
import { v4 } from 'uuid';
import { message } from 'antd';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const openModel = () => {
    setVisible(true)
  };
  const closeModel = () => {
    setVisible(false)
  };
  const handleSignUp = (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password).then(async(userCred)=>{
      message.info('creating your account', 5)
      const user = userCred.user;
      dispatch(setUser(user));
    }).then(()=>{
      navigate('/signin')
    }).catch((error)=> {
      const errorCode = error.code;
      const errorMessage = error.message;
      dispatch(setUser([]));
    })
  }
  const handelGoogle = () =>{
    signInWithPopup(auth,provider).then((result)=>{
      const user = result.user;
      dispatch(setUser(user));
      dispatch(AuthSuccess());
      console.log(user)
      const unq = v4()
      navigate(`/loading/${user.uid}`)
    }).catch((error) => {
      console.log(error);
      dispatch(setUser([]))
      dispatch(AuthFail())
    });
  };
  return (
    <section className='h-min-screen text-dim-white'>
      {!visible && <section>
          <div className='flex justify-center items-center bg-secondary lg:my-4 sm:my-8 rounded-lg' onClick={openModel}>
          <button className='text-base subpixel-antialiased antialiased font-semibold mx-2'>
            Sign Up
          </button>
          <img width="100" height="100" className='w-1/6' src="https://img.icons8.com/clouds/100/new-post.png" alt="new-post"/>
        </div>
        <div className='flex justify-center px-2 rounded-lg bg-secondary items-center'>
          <button className='text-base subpixel-antialiased antialiased font-semibold mx-2' onClick={handelGoogle}>Sign In with Google</button>
          <img width="100" height="100" className='w-1/6' src="https://img.icons8.com/clouds/100/google-logo.png" alt="google-logo"/>
        </div>
        <div className='w-11/12 m-auto mt-6'>
          <a className='text-blue' href='/signin'>Already Have an account? Log In</a>
        </div>
      </section>}
      {/* signup form model */}
      {
        visible && <div className='bg-white  p-16 rounded-lg'>
        <div className=' flex justify-between'>
          <h1 className='text-3xl my-2 text-main'>
            Sign Up
          </h1>
          <button onClick={closeModel} className='text-thin text-xs'>Cancel</button>
        </div>
        <form onSubmit={handleSignUp} className='flex flex-col'>
          <label  htmlFor="email" className='text-base text-main subpixel-antialiased antialiased font-normal my-2'>Email</label>
          <input type="email" onChange={(e)=> setEmail(e.target.value)} className='placeholder:italic text-main font-semibold text-xs outline-0 border-0 border-b-2 border-black placeholder:text-slate-400 placeholder:text-xs placeholder:pl-2' id='email' name='email' required placeholder='you@email.com'/>
          
          <label htmlFor="email" className='text-base text-main subpixel-antialiased antialiased font-normal my-2'>Password</label>
          <input type="password" onChange={(e)=> setPassword(e.target.value)} id='password' name='password' required className='text-main font-semibold placeholder:italic border-0 outline-0 border-b-2 border-black placeholder:text-slate-400 placeholder:text-xs placeholder:pl-2' placeholder='*****'/>
          <button type="submit" className='mt-4 bg-blue-500 py-2 w-1/2 m-auto text-white rounded'>Sign Up</button>
        </form>
      </div>
      }
    </section>
  )
}

export default Login