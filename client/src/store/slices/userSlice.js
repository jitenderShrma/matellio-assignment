// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');
const initialState = {
    authenticated: user && token ? true : false,
    token: token,
    user:token || {}, 
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setLoggedIn: (state, action) => {
            state.authenticated = true;
            state.token = action.payload.token;
            state.user = action.payload.user;
        },
        // setAuthenticated: (state, action) => {
        //     state.authenticated = action.payload;
        // },
        // setToken: (state, action) => {
        //     state.token = action.payload;
        // },
        setLogout: (state) => {
            state.authenticated = false;
            state.token = null;
            state.user = {};
        },
        // addAddress: (state, action) => {
        //     state.addresses.push(action.payload);
        // },
        // setPersonalInfo: (state, action) => {
        // },
    },
});

export const { setLoggedIn, setToken, setLogout, addAddress, setPersonalInfo } = userSlice.actions;
export const userState = (state) => state;
export default userSlice.reducer;
