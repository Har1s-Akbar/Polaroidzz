import React, { useState, useEffect } from 'react';
import {fetchSignInMethodsForEmail, sendPasswordResetEmail, signInWithEmailAndPassword} from 'firebase/auth';
import { auth } from '../auth/firebaseConfig';
import {useDispatch } from 'react-redux';
import { AuthFail, AuthSuccess, setUser } from '../store/slice';
import { Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { v4 } from 'uuid';

function Signin() {
  const [modal2Open, setModal2Open] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [loading, setloading] = useState(true);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [resetEmail, setResetEmail] = useState([])
    const navigate = useNavigate();
    const unq = v4()
    const dispatch = useDispatch()
    const signIn = (event) =>{
        message.loading('Wait, we are logging you in', 3)
        event.preventDefault();
        signInWithEmailAndPassword(auth, email,password,).then((userCred)=>{
            const user = userCred.user;
            dispatch(setUser(user));
            dispatch(AuthSuccess())
            navigate(`/loading/${user.uid}`)
        }).catch((error)=> {
            dispatch(AuthFail())
            const errorCode = error.code;
            const errorMessage = error.message;
          });
    }
    const reset = () =>{
        sendPasswordResetEmail(auth, resetEmail).then(()=>{
            message.success('reset link sent successfully', 3)
            setModal2Open(false)
            dispatch(AuthFail())
        }).catch((e)=>{
            message.error(e)
        })
    }
  const fetchImage = async() => {
    setloading(true)
    try{    
        const response = await fetch('https://api.pexels.com/v1/search?query=people&per_page=80',{headers:{Authorization: import.meta.env.VITE_PEXEL_KEY}})
        const data = await response.json();
        setPhotos(data.photos);
        if (data){
         setloading(false)   
        }
    }catch(error){
        console.log(error);
    }
  }
  useEffect(()=>{fetchImage()},[])
  return (
    <section className='overflow-hidden h-screen'>
        <div className='flex flex-col relative items-center z-10 top-10 lg:top-0 justify-center rounded drop-shadow-2xl bg-orange-50 outline-8 outline-slate-500 border-amber-100 m-auto border-black w-11/12 lg:w-2/5 h-4/5 '>
            <div>
                <h1 className='lg:text-4xl text-2xl font-semibold my-5 text-center'>Welcome Back, Log in</h1>
                <p className='text-xs lg:text-sm font-normal my-10 text-center'>Enter your credentials to Log in your account</p>
            </div>
            <div className='w-3/5 lg:w-1/2'>
                <form onSubmit={signIn} className='flex flex-col'>
                    <label htmlFor="email" className='font-semibold my-2 text-base subpixel-antialiased antialiased'>Email</label>
                    <input type="email" onChange={(e)=> setEmail(e.target.value)} name="email" id="emailSign" className='bg-transparent outline-0 border-b-2 border-black placeholder:italic pl-2 ' placeholder='email@gmail.com'/>

                    <label htmlFor="password" className='font-semibold  text-base mt-6  subpixel-antialiased antialiased'>Password</label>
                    <input type="password" name="password" id="passwordSign" onChange={(e)=> setPassword(e.target.value)} className='appearance-none border-b-2 border-black bg-transparent placeholder:italic pl-2 focus:outline-0 hover:outline-0' placeholder='password'/>
                    {/* <Link className='text-blue-500 my-4' to={`/signin/${unq}`}>Forget Your password? Click here</Link> */}
                    <button onClick={()=> setModal2Open(true)} className='my-6 lg:my-3 text-blue-500'>Reset the password?</button>
                    
                    <button type='submit' className='border-2 border-black w-1/2 m-auto rounded py-1 hover:bg-black hover:text-white transition delay-100 duration-300'>Log In</button>
                </form>
            </div>
            <Modal
        title="Reset the password"
        centered
        open={modal2Open}
        onOk={reset}
        onCancel={() => setModal2Open(false)}
       >
        <div className='flex flex-col items-start w-11/12 m-auto'>
        <label htmlFor="text" className='text-white text-2xl'>Email</label>
        <input type="text" onChange={(e)=> setResetEmail(e.target.value)} required placeholder='reset@gmail.com' className='border-b-2 w-2/3 placeholder:italic pl-1 text-white placeholder:white border-b-blue-100 bg-transparent outline-0' />
        </div>
      </Modal>
        </div>
        <motion.div className='grid grid-cols-4 lg:grid-cols-8 brightness-50'
        initial={{y:600}}
        animate={{y:-900}}
        transition={{duration:6,delay:0.6, ease:"easeInOut"}}
        >
            {photos?.map((element)=>
                <img src={element.src.portrait} className='border-amber-100 border-2' alt={element.alt} key={element.id}/>
            )}
        </motion.div>
    </section>
  )
}

export default Signin