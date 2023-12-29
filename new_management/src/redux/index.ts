import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist';
import persistConfig from './persistConfig';
import rootReducer from './reducers';
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({ reducer: persistedReducer });
export const persistor = persistStore(store);
export default store;
