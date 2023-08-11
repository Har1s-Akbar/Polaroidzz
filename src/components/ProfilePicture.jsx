import React, { useEffect, useState } from 'react'
import { Image, Modal,Upload, message } from 'antd'
import ImgCrop from 'antd-img-crop';
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore/lite';
import { db,storage } from '../auth/firebaseConfig';
import { getDownloadURL, uploadBytes, ref } from 'firebase/storage';
import { v4 } from 'uuid';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';


function ProfilePicture({profile}) {
const user = useSelector((state)=> state.reducer.copyUserdata)
const {id} = useParams()
const [open, setOpen] = useState(false);
const [confirmLoading, setConfirmLoading] = useState(false);
const [fileList, setFileList] = useState([]);
const [profilepic, setProfile] = useState([])
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
const showModal = () => {
    setOpen(true);
  };
  const getProfilepicture = async() =>{
    const profileRef = doc(db, 'usersProfile', id)
    const getProfile = await getDoc(profileRef)
    setProfile(getProfile.data().photo)
  }
  const handleOk = async() => {
    // setModalText('The modal will be closed after two seconds');
    if(!fileList){
      message.error('No image Selected')
      }else{
        setConfirmLoading(true)
        const unique = v4();
        // const name = fileList.map((item)=> {return item.name})
        const imageRef =ref(storage, `/profile/${fileList[0].name + v4()}`);
        const Img = await uploadBytes(imageRef, fileList[0].originFileObj).then((snapshot)=>{
            getDownloadURL(snapshot.ref).then(async(url)=>{
                updateDoc(doc(db, 'usersProfile', profile.uid),{
                    photo: url
                })
                const updateRef = collection(db, 'users')
                const queryRef = query(updateRef, where('post_useruid', '==', profile.uid))
                const dataPosts = await getDocs(queryRef)
                const updatePosts = dataPosts.docs.map((item)=> {
                    updateDoc(item.ref,{
                        userPhoto: url
                    })
                })
                const updateCom = collection(db, 'comments')
                const querycom = query(updateCom, where('post_useruid', '==', profile.uid))
                const commentUpdate = await getDocs(querycom)
                const updateComment = commentUpdate.docs.map((item)=>{
                    updateDoc(item.ref,{
                        commentPhoto: url
                    })
                })
            }).then(()=> {
                message.success('Updated successfully')
                setOpen(false)
                setConfirmLoading(false)
        })
        })
      }
  };
  const handleCancel = () => {
    setOpen(false);
  };
  useEffect(()=> {getProfilepicture()}, [open])
return (
    <section className='w-9/12 lg:w-full'>
              <button onClick={user.uid === id ? showModal: ''} className='w-10/12'>
                <Image src={profilepic} preview={false} sizes={'large'} className=' rounded-full' />
              </button>
              <Modal className={user.uid === id ? '': 'hidden'}
              width={150}
                title="Upload Profile"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                maskStyle={{backdropFilter: 'revert-layer'}}
                >
              <ImgCrop rotationSlider>
                <Upload
                    listType='picture-circle'
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={onPreview}
                >
                    {fileList.length < 1 && '+ Upload'}
                </Upload>
                </ImgCrop>
              </Modal>
            </section>
  )
}

export default ProfilePicture