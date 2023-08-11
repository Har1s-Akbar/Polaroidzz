import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist'
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage'
import userSlice from './slice';
import postSlice from './postSlice';
const persistConfig = {
  key: 'root',
  storage: storage,
}

const rootreducer = combineReducers({
  reducer : userSlice.reducer,
  reducerPost: postSlice.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootreducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      
    }).concat(thunk)
})
export default store;
