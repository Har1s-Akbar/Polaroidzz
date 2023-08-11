import React, { useEffect, useState } from 'react'
import { db } from '../auth/firebaseConfig';
import {collection, doc, getDoc, updateDoc, deleteDoc, serverTimestamp, addDoc, query, where, getDocs} from 'firebase/firestore/lite';
import Nav from './Nav';
import { useSelector } from 'react-redux';
import { Image, Avatar } from 'antd';
import { EditOutlined, RightOutlined, BarsOutlined, DeleteOutlined, PlusOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';

function Comments() {
  const [commentText, setComment] = useState('')
  const {id} = useParams();
  const [showSetting, setSetting] = useState(false);
  const [editModal, setmodal] = useState(false);
  const [loading, setloading] = useState(false);
  const [editText, setEditText] = useState('')
  const user = useSelector((state)=> state.reducer.copyUserdata);
  const [cPost, setcPost] = useState([]);
  const [specificPost, setSpecificPost] = useState([]) 
  const navigate = useNavigate();
  
  const settingShow = () => {
    if(showSetting){
      setSetting(false)
    }else{
      setSetting(true)
    }
}
const getSinglePost = async()=>{
  const Data = await getDoc(doc(db, 'posts', id))
  const data = Data.data()
  setSpecificPost(data)
}
  const getComments = async() => {
    const queryRef = collection(db, "comments")
    const commentQuery = query(queryRef, where('postId' ,'==', id))
    const rawData = await getDocs(commentQuery)
    if(rawData.empty){
    setcPost([])
    }else{
      const data = rawData.docs.map((item)=> {return item.data()})
      setcPost(data)
    }
  }
  const handleComment= async(event)=>{
    event.preventDefault();
    setloading(false)
    await addDoc(collection(db, 'comments'),{
      post_useruid : user.uid,
      postId: specificPost.Id,
      commnetProfile: user.name,
      commentPhoto:user.photo,
      comment: commentText,
    })
    setloading(true)
  }
  const handleDelete = async(Id) => {
    const dltRef = doc(db, 'posts', Id)
    await deleteDoc(dltRef)
    navigate('/feed')
  }
  const handleEdit = async(Id) => {
    if(!editModal){
      setmodal(true);
    }else{
      setmodal(false);
    }
  }
  const handleEditText = async(id) => {
    const editRef = doc(db, 'posts', id)
    await updateDoc(editRef,{
      description: editText,
      editedAt: serverTimestamp()
    })
    setmodal(false);
    setloading(true);
    setSetting(false)
  }
  useEffect(()=> {getComments()}, [loading])
  useEffect(()=> {getSinglePost()}, [loading, editModal])
  return (
    <main className= 'flex flex-col overflow-x-hidden lg:flex-row bg-main text-dim-white min-h-screen'>
      <div>
        <Nav/>
      </div>
      <section className='lg:flex lg:flex-col w-full'>
      <div className='bg-secondary hidden my-10 w-1/2 lg:flex items-end rounded-xl m-auto'>
          <Link to={`/profile/${user.uid}`}>
          <Image src={user.photo} preview={false} fallback='https://rb.gy/tebns' className='rounded-full w-1/2 opacity-80 border-2 border-dim-white my-5 ml-5' width={55}/>
          {/* <PlusOutlined className='lg:mb-6'/> */}
          </Link>
      </div>
        <div className={editModal ? 'opacity-50 w-11/12 m-auto lg:m-0 lg:w-9/12': ' lg:m-0 m-auto w-11/12'}>
          <section className='bg-secondary w-full grid grid-cols-1 lg:ml-14 rounded-xl lg:flex-row lg:flex my-5 lg:justify-between'>
                    <div className='lg:w-1/2 w-full flex flex-col justify-between'>
                      <div className='flex flex-col'>
                      <div className='w-full flex items-satrt justify-between mt-3 border-b-2 pb-5 border-dimest'>
                        <div className='flex ml-3 w-6/12 lg:w-full items-start'>
                          <Image src={specificPost.userPhoto} className='rounded-full' preview={false} width={60}/>
                          <div className='flex flex-col items-start mx-3'>
                            <h1 className='text-dim-white text-lg font-bold lg:font-semibold'>{specificPost.userName}</h1>
                            <p className='italic text-xs font-bold'>{specificPost.username}</p>
                            <p className='lg:text-xl text-sm font-thin text-dim-white my-2 font-semibold'>{specificPost.description}</p>
                          </div>
                        </div>
                        <div className=''>
                          {(specificPost.post_useruid === user.uid) === true && <div>
                            <button className='relative' onClick={settingShow}>
                            <Avatar icon={<BarsOutlined/>} className='bg-secondary'/>
                          </button>
                          <div className={showSetting ? 'absolute z-10 border border-white rounded-lg right-7 lg:left-0 lg:w-1/12 bg-main' : 'hidden'} >
                            <div className='bg-main flex flex-col w-1/6 justify-center p-3 rounded-lg lg:ml-6 ml-0'>
                              <button className='flex items-end my-2' onClick={()=> handleDelete(specificPost.Id)}>
                                <Avatar className='' size={'small'} icon={<DeleteOutlined/>}/>
                                <h1 className='text-xs font-medium '>Delete</h1>
                              </button>
                              <button className='flex items-end my-2 ' onClick={()=> handleEdit(specificPost.Id)}>
                                <Avatar className='bg-secondary' size={'small'} icon={<EditOutlined/>} />
                                <h1 className='text-xs font-medium '>Edit</h1>
                              </button>
                            </div>
                          </div>
                          </div>}
                          </div>
                      </div>
                        <div className=' flex-col flex overflow-y-scroll h-60 lg:h-10'>
                          {cPost.map((cmnt, index)=> {
                            return <div key={index} className='my-2 ml-3 flex items-center'>
                              <Avatar src={cmnt.commentPhoto} size={'small'}/>
                              <p className='text-xs font-bold text-dim-white mx-2'>{cmnt.commnetProfile} :</p>
                              <p className='text-xs font-medium opacity-80 text-dim-white'>{cmnt.comment}</p>
                            </div>
                          })}
                        </div>
                      </div>
                        <div className='w-full mb-4 ml-2 flex flex-col items-start justify-center'>
                              <div className='flex items-center'>
                                <Avatar  src={user.photo} className=''/>
                              <h1 className='text-xs font-bold mx-2'>{user.name}</h1>
                              </div>
                              <div className='flex items-end w-full'>
                              <input type="text" name="comment" onChange={(e)=> setComment(e.target.value)} id="comment" className='w-9/12 appearance-none border-b-2 bg-transparent border-dim-white placeholder:italic pl-2 focus:outline-0 hover:outline-0' placeholder='your comment...'/>
                              <button type='submit' onClick={handleComment} className=' m-auto rounded w-1/6 pb-1'><RightOutlined /></button>
                              </div>
                        </div>  
                    </div>
                  <div className='lg:w-3/5 w-full flex row-start-1'>
                    <Image src={specificPost.post_image} className='rounded-xl '/>
                  </div>
                  </section>
              </div>
              
              <div className={editModal ? `border-2 border-secondary opacity-100 bg-main p-10 rounded-md my-2 w-full lg:w-1/2 absolute left-0 lg:left-96 top-80`: 'hidden'}>
                  <div className='flex justify-between mb-10' onClick={()=>{setmodal(false); setSetting(false)}}>
                  <h1 className='text-dim-white text-xl'>Edit Description</h1>
                  <Avatar icon={<CloseOutlined />} className='bg-main'/>
                  </div>
                  <div className='flex items-end'>
                    <input type="text" onChange={(e)=> setEditText(e.target.value)} className='bg-transparent border-b-2 w-11/12 border-dimest placeholder:font-bold placeholder:text-xs placeholder:italic outline-0' placeholder={specificPost.description}/>
                    <button onClick={()=> handleEditText(specificPost.Id)}>
                      <Avatar icon={<CheckOutlined />} className='bg-main mx-3'/>
                    </button>
                  </div>
                </div>
                
      </section>
    </main>
  )
}

export default Comments