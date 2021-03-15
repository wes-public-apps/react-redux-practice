// Wesley Murray
// 3/15/2021
// Add a class to aid in action creation for auth.

import { AccountInfo } from "@azure/msal-common";
import { AUTH_REDUCER_ACTIONS, IAuthAction, IAuthState } from "../reducers/AuthReducer"

//#region Type Definitions
export interface IAuthActions {
    updateAccount(account: AccountInfo | null): void;
    updateError(error: any): void;
    updateToken(idToken: string | null,accessToken: string | null): void;
    clearAuthData(): void;
}
//#endregion

export default class AuthActions {
    //#region Static Methods
    /**
     * Generates redux action for updating current user account object in store.
     * @param account new account object
     * @returns action for AuthReducer that updates the account state
     */
    static updateAccount = (account: AccountInfo | null):IAuthAction => {
        return { 
            type: AUTH_REDUCER_ACTIONS.UPDATE_ACCOUNT, 
            payload: {account}
        };
    }
    /**
     * Generates redux action for updating error object in store
     * @param error 
     * @returns action for AuthReducer that updates error object
     */
    static updateError = (error: any):IAuthAction => {
        return { type: AUTH_REDUCER_ACTIONS.UPDATE_ERROR, payload: {error}};
    }

    /**
     * Generates redux action for updating tokens
     * @param idToken 
     * @param accessToken 
     * @returns action for AuthReducer that updates the tokens in the store
     */
    static updateToken = (idToken: string | null,accessToken: string | null):IAuthAction => {
        return { type: AUTH_REDUCER_ACTIONS.UPDATE_TOKEN, payload: {idToken, accessToken}};
    }

    /**
     * Generates redux action for clearing all user specific authentication data.
     * @returns action for AuthReducer that clears all user specific data from store
     */
    static clearAuthData = ():IAuthAction => {
        return { type: AUTH_REDUCER_ACTIONS.CLEAR_ALL }
    }
    //#endregion
}