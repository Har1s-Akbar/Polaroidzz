import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { query,collection, getDocs, where, doc, getDoc, limit, orderBy, setDoc, updateDoc,arrayRemove, arrayUnion, serverTimestamp, deleteDoc} from 'firebase/firestore/lite';
import Nav from './Nav'
import { db} from '../auth/firebaseConfig';
import { Image, Skeleton, Avatar, message } from 'antd';
import { setcopyData } from '../store/slice';
import { setPosts } from '../store/postSlice';
import { Link, NavLink } from 'react-router-dom';
import { v4 } from 'uuid';
import { PlusOutlined, LikeOutlined, MessageOutlined , SendOutlined, BookOutlined} from '@ant-design/icons';
import Create from './Create';

function Profile() {
  const dispatch = useDispatch()
  const user = useSelector((state)=> state.reducer.userdata);
  const CopyUser = useSelector((state)=> state.reducer.copyUserdata)
  const [Loading, setloading] = useState(true)
  const [loadingUser, setLoading] = useState(true)
  const [posts, setposts] = useState([])
  const [ render, setRender] = useState(false)
  //  states for getting saved posts
  const [saved, setSaved] = useState([])
  const [uniqueSaved, setuniqueSaved] = useState([])
  const getcurrentUser = async() => {
    const getData = await getDoc(doc(db, 'usersProfile', user.uid))
    const data = getData.data()
    dispatch(setcopyData(data))
    setloading(false)
  }

// start of getting all posts from the users collection firebase
  const getPosts = async() => {
    const queryRef = collection(db, 'posts');
      const querySnapshot = await getDocs(queryRef);
      const data = querySnapshot.docs.map((item)=> {return item.data()})
      setposts(data)
      dispatch(setPosts(data))
      setloading(false)
    }
  // end of getting posts
  const handleLikes = async(Id) => {
    setRender(true)
    const idDocument = Id
    const specificRef = doc(db, "posts", Id)
    getDoc(specificRef).then((resp)=> {
      setRender(true)
    const data = resp.data()
    const likesArray = data.likes
    const updateRef = doc(db, "posts", idDocument)
        if(likesArray.includes(user.uid)){
            updateDoc(updateRef,{
                likes: arrayRemove(user.uid)
            })
            setRender(false)
        }
        else{
            updateDoc( updateRef,{
                likes: arrayUnion(user.uid)
            })
            setRender(false)
        }
    })
}
const savePost = async(id) => {
    event.preventDefault();
    const documentRef = doc(db, 'posts', id)
    const queryRef = collection(db, 'saved')
    const savedQuery = query(queryRef, where('savedby', '==', user.uid), where('postId' ,'==', id))
    const getSave = await getDocs(savedQuery)
    if(getSave.docs.map((item)=> {return item.exists()})[0] === true){
      const remove = deleteDoc(getSave.docs.map((item)=> {return item.ref})[0]).then(()=> {message.info('Post Unsaved Successfully')})
      setRender(false)
    }else{
      const unq = v4()
      const postSave = setDoc(doc(db, 'saved', unq),{
        savedby: user.uid,
        postId : id,
        savedAt: serverTimestamp(),
        ref: documentRef,
      }).then(()=> {
        message.success('Post Saved successfully')
        setRender(false)
    })
    
    }
  }
  // start of getting the saved Posts from firebase
  const getSavedPosts = async() => {
    const queryRef = collection(db, 'saved')
    const savedQuery = query(queryRef, where('savedby', '==', user.uid), orderBy('savedAt') ,limit(2))
    const getPosts = await getDocs(savedQuery)
    const Data =  getPosts.docs.map(async(items)=> {      
        if(items.exists()){
            const data = items.data()
            const getSaved = await getDoc(data.ref)
            const savedData = getSaved.data()
            setSaved((prev)=> [...prev, savedData])
        }else{
            return []
        }
    })
}
    useEffect(()=> {getPosts()}, [render, user])
    useEffect(()=> {getcurrentUser()} , [])
    useEffect(()=> {getSavedPosts()}, [user, render])
    useEffect(()=> {
      const unique = [...new Map(saved.map(item => [item['Id'], item])).values()]
      setuniqueSaved(unique)
    },[saved])
    return ( Loading && loadingUser ? <div className='min-h-screen bg-main'></div> :
    <section className={posts.length === 0 ? 'lg:grid lg:grid-cols-5 lg:justify-items-center flex flex-col lg:flex min-h-screen bg-main': 'flex lg:flex-row flex-col min-h-screen bg-main text-dim-white'}>
    <div className='sm:sticky sm:top-0 sm:z-10'>
      <Nav/>
    </div>
    <div className={posts.length === 0? 'w-9/12 col-start-2 col-end-5': "flex flex-col"}>
      <Skeleton loading={Loading} paragraph={{rows:0}}>
          <Link as={NavLink} to={`/profile/${user.uid}`} className={posts.length === 0? 'bg-secondary lg:my-10 lg:w-full lg:flex hidden lg:items-end lg:rounded-xl': 'bg-secondary lg:my-10 lg:w-1/2 lg:flex lg:items-end lg:rounded-xl lg:m-auto hidden'}>
            <Image src={CopyUser.photo} preview={false} fallback='https://rb.gy/tebns' className='rounded-full w-1/2 opacity-80 border-2 border-dim-white my-5 ml-5' width={55}/>
            <PlusOutlined className='mb-4'/>
          </Link>
      </Skeleton>
      <div className='flex flex-col lg:flex-row justify-between lg:w-11/12'>
        <div className={posts.length === 0 ? '': 'px-2 lg:ml-10 lg:w-7/12'}>
          {
            posts.map((item)=> {
              return <section key={item.Id} className='lg:my-10 my-7'>
                <div className='w-full my-3 lg:my-5 bg-secondary pt-5 pb-5 px-5 rounded-xl'>
                <div className='flex items-center w-full'>
                  <Skeleton paragraph={{rows:1}} loading={Loading} avatar>
                    <Link as={NavLink} to={`/profile/${item.post_useruid}`} className='flex items-center lg:w-full w-2/5'>
                      <Image src={item.userPhoto} preview={false} width={60} className='rounded-full w-1/2'/>
                      <div className='flex w-full items-start flex-col ml-3'>
                        <h1 className='lg:text-xl text-dim-white font-medium'>{item.userName}</h1>
                        <p className='lg:text-sm text-xs text-sim-white font-bold italic opacity-90'>@{item.username}</p>
                      </div>
                    </Link>
                  </Skeleton>
                </div>
                <Skeleton paragraph={{rows:0}} className='lg:my-4' loading={Loading}>
                  <h1 className='lg:text-xl text-base lg:my-3 my-1 ml-2 text-dim-white font-semibold'>{item.description}</h1>
                </Skeleton>
                <div className='lg:mt-2 mt-1'>
                    <Image src={item.post_image} className='rounded-md'/>
                </div>
              </div>
              <div className='bg-secondary rounded-xl w-full py-2 lg:py-5 '>
              <div className='flex items-start w-11/12 m-auto justify-between'>
                <button onClick={()=> handleLikes(item.Id)} className='flex items-center'>
                  <h1 className='mx-2 text-xl font-thin text-dim-white'>{item.likes.length}</h1>
                  {/* <h1 className='mx-2 text-xl font-thin text-dim-white'>0</h1> */}
                  <Avatar icon={<LikeOutlined />} className='bg-secondary' style={{fontSize: '150%'}} size={'large'}/>
                </button>
                <button>
                  <Link as={NavLink} to={`/comments/${item.Id}`}>
                    <Avatar icon={<MessageOutlined />} className='bg-secondary'style={{fontSize: '150%'}} size={'large'}/>
                  </Link>
                </button>
                <button onClick={()=> {message.info('working on this feature will be available soon')}}>
                  <Avatar icon={<SendOutlined />} className='bg-secondary -rotate-45'style={{fontSize: '150%'}} size={'large'}/>
                </button>
                <button onClick={()=> {savePost(item.Id)}}>
                  <Avatar icon={<BookOutlined />} className='bg-secondary'style={{fontSize: '150%'}} size={'large'}/>
                </button>
              </div>
          </div>
            </section>
            })
          }
          </div>
          <section className={posts.length === 0 ? 'lg:flex lg:flex-col lg:w-1/2 sm:hidden': 'hidden lg:flex lg:flex-col lg:sticky lg:top-0 lg:h-1/4 lg:w-4/12'}>
          <div className={posts.length === 0 ? 'w-full ml-96 my-10':'my-10 m-auto w-11/12'}>
              <Create/>
            </div>
            <span className={posts.length === 0 ? 'w-full border border-dim-white opacity-70 ml-96': 'w-full border border-dim-white opacity-70'}></span>
              <div className={uniqueSaved.length === 0 ? ' border-b hidden border-dim-white ' : ' my-5'}>
                <div className=' mb-5'>
                  <h1 className='text-2xl font-semibold text-dim-white'>Saved Posts</h1>
                </div>
                <div className='items-center rounded-xl gap-1 place-content-center grid grid-cols-2 w-full'>
                  {uniqueSaved.map((item)=> {
                    return <div key={item.Id}>
                      <Image className='rounded-xl' preview={false} src={item.post_image}/>
                    </div>
                  })}
                  <div className={uniqueSaved.length === 0 ? 'flex flex-col items-center justify-center col-span-2': 'flex flex-col items-center col-span-2 justify-center'}>
                    <h1 className={uniqueSaved.length === 0 ? 'text-dim-white text-2xl opacity-50 font-thin my-1': 'text-dim-white text-base font-semibold my-1'}>{
                      uniqueSaved.length === 0 ? 'Save some posts' : 'See All Saved Posts' 
                    }</h1>
                    <button className={uniqueSaved.length === 0 ? 'hidden': 'w-9/12 bg-secondary rounded-lg py-2 my-1 opacity-60 hover:opacity-100 transition delay-200 ease-in-out'}>
                      <Link as={NavLink} to={`/profile/${user.uid}`}>
                        Visit
                      </Link>
                    </button>
                  </div>
                  </div>
              </div>
          </section>
        </div>
      </div>
  </section>
  )
}

export default Profile