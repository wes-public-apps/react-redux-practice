// Wesley Murray
// 3/15/2021
// Add a class to aid in action creation for auth.

import { AccountInfo } from "@azure/msal-common";
import { AUTH_REDUCER_ACTIONS, IAuthAction, IAuthState } from "../reducers/AuthReducer"

export interface IAuthActions {
    updateAccount(account: AccountInfo | null): void;
    updateError(error: any): void;
    updateToken(idToken: string | null,accessToken: string | null): void;
}

export default class AuthActions {
    static updateAccount = (account: AccountInfo | null):IAuthAction => {
        return { 
            type: AUTH_REDUCER_ACTIONS.UPDATE_ACCOUNT, 
            payload: {account}
        };
    }

    static updateError = (error: any):IAuthAction => {
        return { type: AUTH_REDUCER_ACTIONS.UPDATE_ERROR, payload: {error}};
    }

    static updateToken = (idToken: string | null,accessToken: string | null):IAuthAction => {
        return { type: AUTH_REDUCER_ACTIONS.UPDATE_TOKEN, payload: {idToken, accessToken}};
    }
}