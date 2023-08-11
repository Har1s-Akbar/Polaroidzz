import { db, storage } from '../auth/firebaseConfig';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore/lite';
import { getDownloadURL, uploadBytes, ref } from 'firebase/storage';
import {
  Button,
  Input,
  ColorPicker,
  Modal,
  Form,
  InputNumber,
  Select,
  Space,
  Upload,
  message,
} from 'antd';
import ImgCrop from 'antd-img-crop'
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { v4 } from 'uuid';
import { useNavigate, useParams } from 'react-router-dom';
const { Option } = Select;

const getBase64 = (file) =>
new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
});
const formItemLayout = {
  labelCol: {
    span: 30,
  },
  wrapperCol: {
    span: 30,
  },
};
const MobileItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 10,
  },
};
function Profileform (){
  const {id} = useParams()
  const navigate = useNavigate()
  const user = useSelector((state)=> state.reducer.userdata);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [filelist, setFileList] = useState([])
  const handleChange = ({ fileList: newFileList }) => {setFileList(newFileList)};
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const onFinish = async(values) => {
    const metaData = {
      customMetaData:{
        'uid': user.uid
      }
    }
    message.loading('creating your account', 7)
    const profilepicRef = ref(storage, `profile/${filelist[0].uid}`);
    const uploadPic = await  uploadBytes(profilepicRef, filelist[0].originFileObj).then((snap)=>{
      // snap.metadata(metaData)
      getDownloadURL(snap.ref).then(async(url)=>{
        const unique = v4()
        await setDoc(doc(db, 'usersProfile', user.uid),{
              Id: unique,
              name: values.name,
              email:user.email,
              age: values.input_number,
              gender:values.select,
              username: values.username,
              login: 0,
              uid: user.uid,
              description: values.description,
              photo: url,
              followers: [],
              following:[],
              isanonymous : user.isAnonymous,
              Isverified: user.emailVerified,
              time: serverTimestamp(),
        }
        ).then(()=> {
          message.success(`${values.name}, your account is created`)
          navigate('/feed')
        })
      })
    })
  };
  return(
  <section className='flex flex-col items-center justify-center w-full mt-4 overflow-x-hidden'>
    <div className='text-center'>
    <h1 className='text-2xl my-2 font-normal'>Hi, <span className='italic'>{user.email}</span></h1>
    <h1 className='text-lg font-normal my-4'>Help us set up your</h1>
    <h1 className='text-7xl font-light my-6'>
    Profile
    </h1>
    </div>

    {/* Laptop view form */}
    <Form
    className='rounded-lg hidden p-10 lg:block shadow-2xl'
    layout='vertical'
    name="validate_other"
    size='medium'
    {...formItemLayout}
    onFinish={onFinish}
    initialValues={{
      'input-number': 18,
      'color-picker': null,
    }}
  >
    <div className='flex items-center justify-center flex-col'>

    <section className='flex w-full items-center justify-center'>
    <div className='w-full flex flex-col'>
    <Form.Item label="Profile Picture" rules={[
        {
          required: true,
          message: 'profile picture is required',
        },
      ]}>
      <Form.Item noStyle>
      <ImgCrop rotationSlider>
        <Upload
        style={{aspectRatio: 2/1}}
          listType="picture-circle"
          fileList={filelist}
          onChange={handleChange}
          onPreview={handlePreview}
        >
          {filelist.length === 0 && '+ Upload'}
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
      </Form.Item>
    </Form.Item>
    <Form.Item
      name="colorPicker"
      label="Select your favourite color"
    >
      <ColorPicker />
    </Form.Item>

    <Form.Item label="Age">
      <Form.Item name='input_number' noStyle>
        <InputNumber min={18} max={100} />
      </Form.Item>
    </Form.Item>
    </div>
    <div>
    <Form.Item label="Name" name='name' rules={[{ required: true, message: 'Please input your Name!' }]}>
      <Input placeholder='Joh Doe' className=''/>
    </Form.Item>
    <Form.Item label="User Name" name='username' rules={[{ required: true, message: 'Please input your username!' }]}>
      <Input placeholder='@johndoe'/>
    </Form.Item>
    <Form.Item label="Description" name='description' rules={[{ required: true, message: 'Please input your profile Description!' }]}>
      <TextArea rows={3} placeholder='Hey new here....'/>
    </Form.Item>
    <Form.Item
      name="select"
      label="Select"
      hasFeedback
      rules={[
        {
          required: true,
          message: 'Please select your country!',
        },
      ]}
    >
      <Select placeholder="Please select your Gender">
        <Option value="gay">Gay</Option>
        <Option value="lesbian">Lesbian</Option>
        <Option value="queer">Queer</Option>
        <Option value="disable">Disable</Option>
        <Option value="others">Others</Option>
      </Select>
    </Form.Item>

    </div>
    </section>
    <Form.Item
      wrapperCol={{
        span: 12,
        offset: 6,
      }}
    >
      <Space>
        <Button type="primary" className='bg-blue-600' htmlType="submit">
          Submit
        </Button>
        <Button htmlType="reset" className='' type='primary bg-orange-500'>reset</Button>
      </Space>
    </Form.Item>
    </div>
  </Form>
{/* laptop view end */}


  {/* mobile view form */}
    <Form
    className='rounded-lg p-5 m-auto w-11/12 lg:hidden block shadow-2xl'
    layout='vertical'
    name="validate_form"
    size='medium'
    {...MobileItemLayout}
    onFinish={onFinish}
    initialValues={{
      'input-number': 18,
      'color-picker': null,
    }}
  >
    <div className=''>

    <section className=''>
    <div className='w-full grid grid-cols-2'>
    <Form.Item label="Profile Picture" rules={[
        {
          required: true,
          message: 'profile picture is required',
        },
      ]}>
      <Form.Item noStyle>
      <ImgCrop rotationSlider >
        <Upload 
          multiple={false}
          style={{aspectRatio: 2/1}}
          listType="picture-circle"
          fileList={filelist}
          onChange={handleChange}
          onPreview={handlePreview}
        >
          {filelist.length === 0 && '+ Upload'}
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
      </Form.Item>
    </Form.Item>
    <Form.Item
      name="colorPicker"
      
      label="Favourite color"
    >
      <ColorPicker />
    </Form.Item>

    <Form.Item label="Age">
      <Form.Item name='input_number' noStyle>
        <InputNumber min={18} max={100} />
      </Form.Item>
    </Form.Item>
    </div>
    <div>
    <Form.Item label="Name" style={{width: '75%'}} name='name' rules={[{ required: true, message: 'Please input your Name!' }]}>
      <Input placeholder='Joh Doe' className=''/>
    </Form.Item>
    <Form.Item label="User Name" name='username' style={{width: '80%'}} rules={[{ required: true, message: 'Please input your username!' }]}>
      <Input placeholder='@johndoe'/>
    </Form.Item>
    <Form.Item label="Description" name='description' style={{width: '90%'}} rules={[{ required: true, message: 'Please input your profile Description!' }]}>
      <TextArea rows={3} placeholder='Hey new here....'/>
    </Form.Item>
    <Form.Item
    style={{width: '60%'}}
      name="select"
      label="Select"
      hasFeedback
      rules={[
        {
          required: true,
          message: 'Please select your country!',
        },
      ]}
    >
      <Select placeholder="Please select your Gender">
        <Option value="gay">Gay</Option>
        <Option value="lesbian">Lesbian</Option>
        <Option value="queer">Queer</Option>
        <Option value="disable">Disable</Option>
        <Option value="others">Others</Option>
      </Select>
    </Form.Item>

    </div>
    </section>
    <Form.Item
      wrapperCol={{
        span: 12,
        offset: 4,
      }}
    >
      <Space>
        <Button type="primary" className='bg-blue-600' htmlType="submit">
          Submit
        </Button>
        <Button htmlType="reset" className='' type='primary bg-orange-500'>reset</Button>
      </Space>
    </Form.Item>
    </div>
  </Form>
  </section>
)};
export default Profileform;