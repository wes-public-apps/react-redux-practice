// Wesley Murray
// 3/13/2021
// Define the app reducer function to be a composite of it's building blocks.

import { combineReducers } from 'redux';
import { AuthReducer, IAuthState } from './AuthReducer';

export interface IAppStore{
    auth: IAuthState
}

export default combineReducers({
    auth: AuthReducer,
});