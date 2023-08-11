import {createSlice} from '@reduxjs/toolkit';

const postSlice = createSlice({
  name:'posts',
  initialState:{
    userPosts: [],
  }, 
  reducers:{
    setPosts(state, action){
      state.userPosts = action.payload
    },
    postClear(state){
      state.userPosts = []
    }
  },
})

export const {setPosts, postClear} = postSlice.actions;
export default postSlice;