import tokenReducer from "./stateReducer";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    token : tokenReducer,
})

const store = configureStore({reducer:rootReducer})


export default store;