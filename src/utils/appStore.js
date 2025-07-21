import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionReducer from "./connectionSlice";
import requestReducer from "./requestSlice";

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist"

import storage from "redux-persist/lib/storage"


const persistConfigUser = {
    key : "user",
    storage,

} ;

const persistedUserReducer = persistReducer(persistConfigUser, userReducer );

const appStore = configureStore({
    reducer : {
        user : persistedUserReducer,
        feed : feedReducer,
        connections : connectionReducer,
        requests : requestReducer,

    },
    middleware : (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck : {
                ignoreActions : [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),

});

export const persistor = persistStore(appStore) ;
export default appStore;