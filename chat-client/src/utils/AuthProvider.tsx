// Wesley Murray
// 3/13/2021
// Create a util for handling authentication.

import { AuthenticationResult, Configuration, EndSessionRequest, PublicClientApplication } from "@azure/msal-browser";
import React from "react";
import { connect } from "react-redux";
import Auth_Config from "../config/auth-config.json";
import { IAppStore } from "../reducers/AppReducer";
import { IAuthState } from "../reducers/AuthReducer";

//#region Type Definitions
interface IAuthConfig {
    MSAL_CONFIG: Configuration;
    SERVER_CONFIG: IAuthServerConfig;
    LOGIN_REQUEST_CONFIG: IAuthRequestConfig;
    TOKEN_REQUEST_CONFIG: IAuthRequestConfig;
    SILENT_REQUEST_CONFIG: IAuthRequestConfig;

}

interface IAuthServerConfig{
    resourceUri: string;
    resourceScopes: string[];
}

interface IAuthRequestConfig {
    scopes: string[];
}

type IAuthProviderProps = IAuthState;
interface IAuthProviderState{

}
//#endregion

class AuthProvider extends React.Component<IAuthProviderProps,IAuthProviderState> {
    //#region Static Variables
    private static readonly AUTH_CONFIG: IAuthConfig = Auth_Config;
    //#endregion

    //#region Static Methods

    /**
     * Determines if redirection is necessary for login.
     * @returns true if browser requires redirect instead of popup login.
     */
    private static redirect = () => {
        const ua = window.navigator.userAgent;
        const msie = ua.indexOf("MSIE ") > -1;
        const msie11 = ua.indexOf("Trident/") > -1;
        return msie || msie11;
    };
    //#endregion

    //#region Class Variables
    private msal: PublicClientApplication = new PublicClientApplication(AuthProvider.AUTH_CONFIG.MSAL_CONFIG);
    //#endregion

    //#region Constructors
    //For singleton pattern
    public constructor(props: IAuthProviderProps){ 
        super(props);
        AuthProvider.AUTH_CONFIG.LOGIN_REQUEST_CONFIG.scopes = [...AuthProvider.AUTH_CONFIG.LOGIN_REQUEST_CONFIG.scopes,...AuthProvider.AUTH_CONFIG.SERVER_CONFIG.resourceScopes];
        AuthProvider.AUTH_CONFIG.TOKEN_REQUEST_CONFIG.scopes = [...AuthProvider.AUTH_CONFIG.TOKEN_REQUEST_CONFIG.scopes,...AuthProvider.AUTH_CONFIG.SERVER_CONFIG.resourceScopes];
        AuthProvider.AUTH_CONFIG.SILENT_REQUEST_CONFIG.scopes = [...AuthProvider.AUTH_CONFIG.SILENT_REQUEST_CONFIG.scopes,...AuthProvider.AUTH_CONFIG.SERVER_CONFIG.resourceScopes];
    }
    //#endregion

    //#region Class Methods
    //#region Public Methods
    signIn = async (redirect: boolean) => {
        if(redirect){
            return this.msal.loginRedirect(AuthProvider.AUTH_CONFIG.LOGIN_REQUEST_CONFIG)
        }
        return this.msal.loginPopup(AuthProvider.AUTH_CONFIG.LOGIN_REQUEST_CONFIG)
            .then(this.onLoginHandler)
            .catch(err => console.log(err));
    }

    signOut = async () => {
        const logoutRequest: EndSessionRequest = {
            account: this.props.account ? this.props.account : undefined
        }
        return this.msal.logout(logoutRequest)
    }
    acuireToken = async () => {}
    //#endregion

    //#region Private Methods
    private onLoginHandler = (res: AuthenticationResult) => {}
    private getAccounts(){

    }
    //#endregion

    //#endregion

}
 const mapStateToProps = (store: IAppStore): IAuthState => {
     return {
         ...store.auth
     };
 }

export default connect(mapStateToProps)(AuthProvider);