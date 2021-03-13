import React from 'react';

export interface IMessage{
    User: string,
    Message: string
}

const Message = (props: IMessage) => (
    <div style={{ background: "#eee", borderRadius: '5px', padding: '0 10px' }}>
        <p><strong>{props.User}</strong> says:</p>
        <p>{props.Message}</p>
    </div>
);

export default Message;