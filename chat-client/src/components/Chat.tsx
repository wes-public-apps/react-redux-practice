// Wesley Murray
// 3/10/2021
// This component handles the chat app functionality.

import React from 'react';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import { IMessage } from './Message';

//#region Type Definitions
interface IChatProps {
}

interface IChatState {
    connection: HubConnection | null;
    messages: IMessage[];
}
//#endregion

class Chat extends React.Component<IChatProps,IChatState>{
    state: IChatState;

    constructor(props: IChatProps){
        super(props);

        //Connect to ASP.NET Hub for real-time communication
        let newConnection: HubConnection | null = null;
        try {
            console.log("Building Connection");
            newConnection = new HubConnectionBuilder()
                .withUrl(process.env.BACKEND_URL+'/hub')
                .withAutomaticReconnect()
                .build();
            console.log("built without error")
        }catch(e){
            console.log(e);
        }

        //Initialize state
        this.state = {
            connection: newConnection,
            messages: [{User: "user",Message: "message"}]
        }
    
        if(this.state.connection===null) return;

        this.state.connection.start()
        .then(result => {
            console.log("Connection Established");
            this.state.connection!.on('RecieveMessage',(user: string, message: string) => {
                console.log(user+" "+message);
                this.setState(state => {         
                    return {
                      connection: state.connection,
                      messages: [...state.messages, {User:user,Message:message}]
                    };
                });
                console.log(this.state);
            });

        })
        .catch(e => console.log("Failed to Connect."))
    }

    //#region Public Methods
    /**
     * Calls ASP.NET Core Hub method "SendMessage".
     * @param message message to send to recipients
     */
    sendMessage = async (user: string, message: string)=>{
        try {
            if (this.state.connection!.state===HubConnectionState.Connected){
                console.log("Message Sent");
                await this.state.connection!.send('SendMessage', user, message);
            }else{
                console.log("Disconnected");
            }
        }
        catch(e) {
            console.log(e);
        }
    }

    render(){
        if (this.state.connection===null) return <p>No Connection!</p>;
        return (
            <div>
                <ChatInput sendMessage={this.sendMessage} />
                <hr />
                <ChatWindow messages={this.state.messages}/>
            </div>
        );
    }
    //#endregion
}

export default Chat;