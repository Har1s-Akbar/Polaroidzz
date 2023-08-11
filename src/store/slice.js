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
    clearfunc(state){
      state.copyUserdata = [];
      state.isAuthenticated = false;
      state.userdata = [];
    }
  }
});

export const {setUser, AuthSuccess,AuthFail, setcopyData, clearfunc} = userSlice.actions;
export default userSlice