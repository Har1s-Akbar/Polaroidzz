import React, { useEffect, useState } from 'react';
import {motion} from 'framer-motion'
import Login from '../auth/LoginLogic';
function Hero() {
    const [photos, setPhotos] = useState([])
    const [loading, setloading] = useState(true)
  const fetchImage = async() => {
    setloading(true)
    try{    
        const response = await fetch('https://api.pexels.com/v1/curated?&per_page=80',{
            headers:{
                Authorization: import.meta.env.VITE_PEXEL_KEY,
                
            }})
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
        loading ? <div><h1>Loading...</h1></div>:
    <section className='w-full h-screen overflow-hidden relative grid gap-x-8 gap-y-4 sm:gap-x-1 sm-gap-y-1 items-center bg-black'>
        {/* bg-gradient-to-r from-left to-right */}
        <motion.div className='grid lg:grid-cols-8 m-auto sm:grid-cols-4'
            
            initial={{y:250, scale:1}}
            animate={{y:-500, scale:[1.5]}}
            transition={{duration:6,delay:0.6, ease:"easeInOut"}}
            >
            {photos?.map((element)=>
                <img src={element.src.portrait} className='border-gray-50 lg:border-2 border brightness-50 even:saturate-100 odd:grayscale' alt={element.alt} key={element.id}/>
            )}
        </motion.div>
        <motion.div className='absolute lg:w-1/2 bottom-1/3 lg:left-1/4 sm:w-full sm:left-0'
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{duration:2, delay:4}}
        >
            <div className=' flex flex-col justif-center items-center'>
                <h1 className='text-dim-white subpixel-antialiased antialiased tracking-wider font-semibold lg:text-3xl sm:text-xl leading-10 text-center w-5/6 my-10 '>
                    Join the community &
                    share your moments with people!! 
                </h1>
                <Login/>
            </div>
        </motion.div>
    </section>
  )
}

export default Hero