// Wesley Murray
// 3/10/2021
// This react component handles the form for entering a message to send.

import React from 'react';

//#region Type Definitions
interface IChatInputProps{
    sendMessage(user: string,message: string): void;
}

interface IChatInputState{
    user: string;
    message: string;
}
//#endregion

class ChatInput extends React.Component<IChatInputProps,IChatInputState>{
    state: IChatInputState;

    constructor(props: IChatInputProps){
        super(props);
        this.state = {
            user: "",
            message: ""
        }
    }

    //#region Public Methods
    /**
     * Handle form submission.
     * @param e 
     */
    onSubmit = (e: React.FormEvent<HTMLFormElement>)=>{
        const isMessageProvided = this.state.message && this.state.message !== '';
        const isUserProvided = this.state.user && this.state.user !== '';

        if (isUserProvided && isMessageProvided) {
            this.props.sendMessage(this.state.user,this.state.message);
        } 
        else {
            alert('Please insert a message.');
        }

        this.setState({message: ""});

        e.preventDefault();
    }

     /**
     * Handle changes to the user form.
     * @param e change event for input
     */
    onUserUpdate = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({user: e.currentTarget.value});
    }

    /**
     * Handle changes to the message form.
     * @param e change event for input
     */
    onMessageUpdate = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({message: e.currentTarget.value});
    }

    /**
     * Defines input form for chat.
     * @returns form to enter a message
     */
    render(){
        return (
            <form 
                onSubmit={this.onSubmit}>
                <label htmlFor="user">user:</label>
                <br />
                <input 
                    type="text"
                    id="user"
                    name="user" 
                    value={this.state.user}
                    onChange={this.onUserUpdate} />
                <br/><br/>
                <label htmlFor="message">Message:</label>
                <br />
                <input 
                    type="text"
                    id="message"
                    name="message" 
                    value={this.state.message}
                    onChange={this.onMessageUpdate} />
                <br/><br/>
                <button>Submit</button>
            </form>
        )
    }
    //#endregion

}

export default ChatInput;