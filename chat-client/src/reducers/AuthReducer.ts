// Wesley Murray
// 3/13/2021
// Define reducer for auth state.

import { AccountInfo } from "@azure/msal-browser";

//#region Type Definitions
type IAuthState = {
    account: AccountInfo | null,
    error: any,
    idToken: string | null,
    accessToken: string | null,
    isAuthenticated: boolean,
};

type IAuthAction = {
    type?: AUTH_REDUCER_ACTIONS,
    payload?: IAuthState
};
//#endregion

//#region Constants
export const enum AUTH_REDUCER_ACTIONS {
    UPDATE_ACCOUNT,
    UPDATE_ERROR,
    UPDATE_TOKEN,
}

const initialState: IAuthState = {
    account: null,
    error: null,
    idToken: null,
    accessToken: null,
    isAuthenticated: false,
};
//#endregion

//#region Reducer
export const AuthReducer = (state: IAuthState = initialState, action: IAuthAction = {}) => {
    switch (action.type) {
        case AUTH_REDUCER_ACTIONS.UPDATE_ACCOUNT:
            return {
                ...state,
                account: action.payload,
                idToken: action.payload?.idToken,
                accessToken: action.payload?.accessToken,
                isAuthenticated: true
            };

        case AUTH_REDUCER_ACTIONS.UPDATE_ERROR:
            return {
                ...state,
                error: action.payload,
                isAuthenticated: false,
            };

        case AUTH_REDUCER_ACTIONS.UPDATE_TOKEN:
            return Object.assign({}, state, {
                idToken: action.payload?.idToken,
                accessToken: action.payload?.accessToken
            });

        default:
            return state
    }
}
//#endregion