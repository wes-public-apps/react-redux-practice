// Wesley Murray
// 3/10/2021
// This component handles the chat app functionality.

import React from 'react';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import { IMessage } from './Message';
import ChatHubConfig from '../config/chathub-config.json';
import { IAppStore } from '../reducers/AppReducer';
import { AccountInfo } from '@azure/msal-common';
import { connect } from 'react-redux';

//#region Type Definitions
interface IChatProps {
    user?: AccountInfo | null;
    accessToken: string;
}

interface IChatState {
    connection: HubConnection | null;
    messages: IMessage[];
}
//#endregion

//#region Chat Hub Method Names
enum ClientHubMethods {
    onRecieveMessage = 'RecieveMessage',
}

enum ServerHubMethods {
    SendMessage = "SendMessage",
}
//#endregion

class Chat extends React.Component<IChatProps,IChatState>{
    state: IChatState;

    constructor(props: IChatProps){
        super(props);

        //Initialize state
        this.state = {
            connection: null,
            messages: [],
        }
    }

    //#region Public Methods
    /** Hook into component props or state changed event */
    componentDidUpdate(){
        if(this.props.accessToken!=="") this.establishChatHubConnection();
    }

    /**
     * Calls ASP.NET Core Hub method "SendMessage".
     * @param message message to send to recipients
     */
    sendMessage = async (message: string)=>{
        try {
            if (this.state.connection?.state===HubConnectionState.Connected){
                console.log("Message Sent");
                await this.state.connection?.send(ServerHubMethods.SendMessage, message);
            }else{
                this.setState({connection: null});
            }
        }
        catch(e) {
            console.log(e);
        }
    }

    render(){
        if (!this.state.connection) return <p>No Connection!</p>;
        return (
            <div>
                <ChatInput sendMessage={this.sendMessage} />
                <hr />
                <ChatWindow messages={this.state.messages}/>
            </div>
        );
    }
    //#endregion

    //#region Private Methods
    /** Establishes connection with chathub. Gets connection url from chathub-config.json file. */
    private establishChatHubConnection(){
        if(this.state.connection) return;
        let newConnection: HubConnection | null;

        //Connect to ASP.NET Hub for real-time communication
        try {
            console.log("Building Connection");
            console.log(this.props.accessToken);
            newConnection = new HubConnectionBuilder()
                .withUrl(ChatHubConfig.BACKEND_URL+ChatHubConfig.SIGNALR_EXT,{
                    accessTokenFactory: () => this.props.accessToken
                })
                .withAutomaticReconnect()
                .build();
            console.log("built without error")
        }catch(e){
            newConnection=null;
            console.log(e);
        }
    
        if(!newConnection) return;

        //Start Connection
        newConnection.start()
            .then(result => {
                console.log("Connection Established");
                //Define server callable client methods
                newConnection?.on(ClientHubMethods.onRecieveMessage,(user: string, message: string) => {
                    console.log(user+" "+message);
                    this.setState(state => {         
                        return {
                            messages: [...state.messages, {User:user,Message:message}]
                        };
                    });
                });

            })
            .catch(function(e){console.log("Failed to Connect.")})

        //Add a handler for if connection disconnects
        newConnection.onclose(() => { 
            alert("Connection Lost"); 
            this.setState({connection: null});
        })

        //update component
        this.setState({connection: newConnection});
    }

    //#endregion
}

//#region Map store items to Component
const mapStateToProps = (store:IAppStore):IChatProps => {
    return {
        user: store.auth.account,
        accessToken: store.auth.accessToken ? store.auth.accessToken : "",
    }
}

//#endregion

export default connect(mapStateToProps)(Chat);