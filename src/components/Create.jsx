import { useState} from 'react';
import Nav from './Nav';
import { Upload, Modal, Image, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import { db,storage } from '../auth/firebaseConfig';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import { setDoc, doc, serverTimestamp} from 'firebase/firestore/lite';
import { useSelector } from 'react-redux';
import {v4} from 'uuid'
import { useNavigate } from 'react-router-dom';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function Create() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [Description, setDescription] = useState(null);
  const [fileList, setFileList] = useState([])
  const user = useSelector((state)=> state.reducer.copyUserdata);
  const navigate = useNavigate()

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const handleCancel = () => setPreviewOpen(false);
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const setPost = async() => {
    event.preventDefault()
    const uniqueId = v4()
    if(!fileList){
      message.error('Please Add Image')
    }
    else{
      message.loading('Post is being Added', 5)
      const imageRef = ref(storage, `/image/${fileList[0].name + v4()} `);
      const Img = await uploadBytes(imageRef, fileList[0].originFileObj).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url)=>{
          message.loading('Adding Post', 5)
          setDoc(doc(db, "posts", uniqueId), {
            Id : uniqueId,
            description: Description,
            post_image: url,
            userName: user.name,
            userEmail: user.email,
            username: user.username,
            userPhoto:user.photo,
            post_useruid: user.uid,
            isVerified: user.Isverified,
            likes: [],
            time: serverTimestamp(),
            editedAt: null
          }).then(()=> {
            message.success('post Added', 2)
            navigate(`/comments/${uniqueId}`)
          }).catch((error)=> {
          })
        });
      })
    }
  }
  return (
    <section className='bg-main h-screen lg:h-full'>
      <section className='lg:hidden block'>
        <Nav/>
      </section>
      <section className='m-auto lg:hidden block my-6 w-9/12 py-2 rounded-xl'>
        <h1 className='text-3xl text-center text-dim-white '>Create Post</h1>
      </section>
      <section className='w-11/12 lg:w-full m-auto text-dim-white'>
      <div className='w-full flex flex-col bg-secondary rounded-xl m-auto py-5'>
        <div className=' w-11/12 m-auto'>
          <div className='w-full'>
            <div className='flex items-center'>
            <div className='lg:w-2/5 w-1/6'>
            <Image src={user.photo} preview={false} className=' rounded-full' />
            </div>
            <div className='w-full ml-4'>
              <h1 className='text-xl font-semibold'>{user.name}</h1>
              <p className='text-xs font-normal italic'>@{user.username}</p>
            </div>
            </div>
          </div>
          <div className=''>
            <input type="text" onChange={(e)=> setDescription(e.target.value)} className=' w-9/12 bg-transparent outline-0 mt-5 placeholder:text-base text-sm font-semibold' placeholder="what's on your mind?"/>
          </div>
          <div className='w-2/5 m-auto pt-2'>
        <ImgCrop rotationSlider aspect={2/1}>
        <Upload
        style={{aspectRatio: 2/1}}
          listType="picture-card"
          fileList={fileList}
          onChange={handleChange}
          onPreview={handlePreview}
        >
          {fileList.length === 0 && '+ Upload'}
        </Upload>
      </ImgCrop>
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
          <img
            alt="example"
            style={{
              width: '100%',
            }}
            src={previewImage}
          />
        </Modal>
          </div>
        </div>
        <button onClick={setPost} className='border w-1/2 m-auto rounded my-3 border-dim-white hover:bg-dim-white hover:text-main transition ease-in-out delay-200 duration-200'>Post</button>
      </div>
    </section>
    </section>
  )
}

export default Create