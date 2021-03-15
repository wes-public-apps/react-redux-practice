// Wesley Murray
// 3/13/2021
// Create a util for handling authentication.

import { AccountInfo, AuthenticationResult, Configuration, EndSessionRequest, PublicClientApplication } from "@azure/msal-browser";
import React from "react";
import { connect } from "react-redux";
import AuthActions, { IAuthActions } from "../actions/AuthActions";
import Auth_Config from "../config/auth-config.json";
import { IAppStore } from "../reducers/AppReducer";
import { AUTH_REDUCER_ACTIONS, IAuthState } from "../reducers/AuthReducer";

//#region Type Definitions
/** Configuration data for Azure AD */
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
/** AuthProvider component data */
interface IAuthProviderProps extends IAuthState,IAuthActions{}
interface IAuthProviderState{}
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
    public constructor(props: IAuthProviderProps){ 
        super(props);
        AuthProvider.AUTH_CONFIG.LOGIN_REQUEST_CONFIG.scopes = [...AuthProvider.AUTH_CONFIG.LOGIN_REQUEST_CONFIG.scopes,...AuthProvider.AUTH_CONFIG.SERVER_CONFIG.resourceScopes];
        AuthProvider.AUTH_CONFIG.TOKEN_REQUEST_CONFIG.scopes = [...AuthProvider.AUTH_CONFIG.TOKEN_REQUEST_CONFIG.scopes,...AuthProvider.AUTH_CONFIG.SERVER_CONFIG.resourceScopes];
        AuthProvider.AUTH_CONFIG.SILENT_REQUEST_CONFIG.scopes = [...AuthProvider.AUTH_CONFIG.SILENT_REQUEST_CONFIG.scopes,...AuthProvider.AUTH_CONFIG.SERVER_CONFIG.resourceScopes];
    }
    //#endregion

    //#region Class Methods

    //#region Public Methods
    /** Sign user into Azure AD */
    signIn = async () => {
        if(AuthProvider.redirect()){
            this.msal.loginRedirect(AuthProvider.AUTH_CONFIG.LOGIN_REQUEST_CONFIG)
        } else {
            this.msal.loginPopup(AuthProvider.AUTH_CONFIG.LOGIN_REQUEST_CONFIG)
                .then(this.onLoginHandler)
                .catch(err => {
                    console.log(err)
                    this.props.updateError(err);
                });
        }
    }

    /** Sign user out of Azure AD */
    signOut = async () => {
        const logoutRequest: EndSessionRequest = {
            account: this.props.account ? this.props.account : undefined
        }
        this.msal.logout(logoutRequest)

        //consider creating a clear all action
        this.props.clearAuthData();
    }

    /** Get authentication token */
    acuireToken = async () => {
        this.msal.acquireTokenSilent(AuthProvider.AUTH_CONFIG.SILENT_REQUEST_CONFIG)
            .then()
            .catch((err)=> { 
                console.warn("Failed getting silent token.");
                if (err) {
                    return this.msal.acquireTokenPopup(AuthProvider.AUTH_CONFIG.TOKEN_REQUEST_CONFIG)
                        .then(this.onLoginHandler)
                        .catch(err => {
                            console.error(err);
                            this.props.updateError(err);
                        });
                } else {
                    console.warn(err);
                }
            });
    }

    render(){
        return (
            this.props.isAuthenticated ? <button onClick={this.signOut}>Logout</button>:<button onClick={this.signIn}>Login</button>
        );
    }
    //#endregion

    //#region Private Methods
    /**
     * Handles processing authentication response object.
     * @param res object containing the result of authentication 
     */
    private onLoginHandler = (res: AuthenticationResult) => {
        if(res != null){
            this.props.updateAccount(res.account ? res.account : this.getAccounts());
            this.props.updateToken(res.idToken,res.accessToken);
        }
    }
    /**
     * Get the currently active account.
     * @returns current account
     */
    private getAccounts(): AccountInfo | null{
        const currAccnts = this.msal.getAllAccounts();
        if(currAccnts===null) return null;
        if(currAccnts.length>1) return currAccnts[0]; // User should choose account. may need more logic here in future.
        if(currAccnts.length===1) return currAccnts[0];
        return null;
    }
    //#endregion

    //#endregion

}

//#region Add Store Items to Class
const mapStateToProps = (store: IAppStore): IAuthState => {
    return {
        ...store.auth
    };
}

const mapDispatchToProps = (dispatch: any): IAuthActions => ({
    updateAccount: (account: AccountInfo | null) => {
         dispatch(AuthActions.updateAccount(account));
    },
    updateError: (error: any) => {
        dispatch(AuthActions.updateError(error));
    },
    updateToken: (idToken: string | null,accessToken: string | null) => {
        dispatch(AuthActions.updateToken(idToken,accessToken));
    },
    clearAuthData: () => {
        dispatch(AuthActions.clearAuthData());
    }
});
//#endregion

export default connect(mapStateToProps, mapDispatchToProps)(AuthProvider);