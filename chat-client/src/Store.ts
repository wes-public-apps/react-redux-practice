// Wesley Murray
// 3/13/2021
// Define method for creating redux store.

import { createStore } from 'redux';
import AppReducer from './reducers/AppReducer';

export default function configureStore() {
    return createStore(AppReducer);
}