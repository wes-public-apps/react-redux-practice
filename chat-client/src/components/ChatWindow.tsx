import React from 'react';
import Message, { IMessage } from './Message';


interface IChatWindowProps {
    messages: IMessage[];
}

interface IChatWindowState{
}

class ChatWindow extends React.Component<IChatWindowProps,IChatWindowState>{
   
    render(){
        return(
            <div>
                {
                    this.props.messages.map((m: IMessage) => <Message 
                        key={Date.now() * Math.random()}
                        User={m.User}
                        Message={m.Message}/>)
                }
            </div>
        )
    }
}

export default ChatWindow;