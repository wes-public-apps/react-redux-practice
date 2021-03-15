// Wesley Murray
// 3/13/2021
// Define reducer for auth state.

import { AccountInfo } from "@azure/msal-browser";

//#region Type Definitions
export type IAuthState = {
    account?: AccountInfo | null,
    error?: any,
    idToken?: string | null,
    accessToken?: string | null,
    isAuthenticated?: boolean,
};

export type IAuthAction = {
    type?: AUTH_REDUCER_ACTIONS,
    payload?: IAuthState,
};
//#endregion

//#region Constants
export enum AUTH_REDUCER_ACTIONS {
    UPDATE_ACCOUNT,
    UPDATE_ERROR,
    UPDATE_TOKEN,
}

const initialState: IAuthState = {
    isAuthenticated: false,
};
//#endregion

//#region Reducer
export const AuthReducer = (state: IAuthState = initialState, action: IAuthAction = {}) => {
    switch (action.type) {
        case AUTH_REDUCER_ACTIONS.UPDATE_ACCOUNT:
            return {
                ...state,
                account: action.payload?.account,
                isAuthenticated: action.payload?.account ? true: false,
            };

        case AUTH_REDUCER_ACTIONS.UPDATE_ERROR:
            return {
                ...state,
                error: action.payload?.error,
                isAuthenticated: false,
            };

        case AUTH_REDUCER_ACTIONS.UPDATE_TOKEN:
            return {
                ...state,
                idToken: action.payload?.idToken,
                accessToken: action.payload?.accessToken,
            };

        default:
            return state
    }
}
//#endregion