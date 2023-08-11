import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState:{
    copyUserdata: null,
    userdata:null,
    isAuthenticated: false,
  },
  reducers:{
    setUser(state, action){
      state.userdata = action.payload
    },
    setcopyData(state, action){
      state.copyUserdata = action.payload
    },
    AuthSuccess(state){
      state.isAuthenticated = true
    },
    AuthFail(state){
      state.isAuthenticated = false
    },
  }
});

export const {setUser, AuthSuccess,AuthFail, setcopyData} = userSlice.actions;
export default userSlice