import React, { useState } from 'react';
import { auth } from '../auth/firebaseConfig';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  HomeFilled,
  PlusOutlined,
  SettingFilled,
  ContactsFilled,
  BellFilled,
} from '@ant-design/icons';
import { Menu, message } from 'antd';
import { v4 } from 'uuid';
function getItem(label, key, icon, children, type, disabled) {
  return {
    key,
    icon,
    children,
    disabled,
    label,
    type,
  };
}
const App = () => {
  const uniq = v4();
  const User = useSelector((state)=> state.reducer.copyUserdata)
//   const items = [
//     getItem(<a href="/feed"></a> , '1', <HomeFilled style={{fontSize:'140%'}} />),
//     getItem(<button onClick={()=> {message.info('working on this feature, will be available soon')}}> <a></a></button>, '2', <ContactsFilled style={{fontSize:'140%'}}/>),
//     getItem(<a href={`/profile/${User.uid}`}><img className='rounded-full w-10' src={User.photo} alt="" /></a>, '3'),
    
//     getItem(<a href={`/create/${uniq}`}></a>, 'sub2', <PlusOutlined style={{fontSize:'140%'}} />),
//     getItem('', 'sub1', <SettingFilled style={{fontSize:'140%'}} />, [
//       getItem('Sign Out', '5'),
//       getItem(<a href="/signup">Sign Up</a>, '6'),
//     ]),
//   ];
  const itemLap = [
    getItem(<a href="/feed">Feed</a> , '1', <HomeFilled style={{fontSize:'120%'}} />),
    getItem(<a onClick={()=> {message.info('working on this feature, will be available soon')}}>Contacts</a>, '2', <ContactsFilled style={{fontSize:'120%'}} />),
    
    getItem(<a onClick={()=> {message.info('working on this feature, will be available soon')}}>Notifications</a>, 'sub2', <BellFilled style={{fontSize:'120%'}} />),
    getItem('settings', 'sub1', <SettingFilled style={{fontSize:'120%'}} />, [
      getItem('Sign Out', '5'),
      getItem(<a href="/signup">Sign Up</a>, '6'),
    ]),
  ];
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentUser = () => {
      auth.onAuthStateChanged((current)=>{
        if(current){
          console.log('signned in')
        }else{
          console.log('signned out')
        }
      })
    }
    
    const signOutFunct = () => {
      currentUser();
      auth.signOut().then(()=>{
        message.success('Logged Out Successfully')
      }).then(()=>{
        navigate('/');
        dispatch(setUser([]));
      })
      .catch((error)=> 
        {console.log(error);
        message.error('Failed to log out')}
      )
    }
  const handleClick = (e) => {
    if(e.key === '5'){
      signOutFunct()
    }
  };
  return (
    <div className='lg:sticky lg:ml-16 lg:top-48'
    >
      {/* </Button> */}
      <Menu
        onClick={handleClick}    
        mode="inline"
        theme='dark'
        className='bg-secondary sm:hidden lg:block rounded-full text-dim-white '
        inlineCollapsed={true}
        items={itemLap}
      />
      {/* <Menu
        onClick={handleClick}    
        mode="horizontal"
        theme='dark'
        className='bg-secondary sm1:px-8 sm1:py-2 sm2:px-14 sm2:py-2 lg:p-0 lg:rounded-full lg:hidden text-dim-white '
        items={items}
      /> */}
    </div>
  );
};
export default App;