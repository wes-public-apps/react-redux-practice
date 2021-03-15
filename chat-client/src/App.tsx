import React from 'react';
import logo from './logo.svg';
import './App.css';
import Chat from './components/Chat';
import { IAppStore } from './reducers/AppReducer';
import { connect } from 'react-redux';
import { Nav, Navbar } from 'react-bootstrap';
import AuthProvider from './utils/AuthProvider';

interface IAppProps {
  isAuthenticated: boolean;
}

interface IAppState{

}

class App extends React.Component<IAppProps,IAppState>{

  constructor(props: IAppProps){ super(props); }

  render(){
    return (
      <div className="ChatApp">
        <Navbar className="ChatAppNavBar" bg="dark" variant="dark">
          <Navbar.Brand href="/">Chat</Navbar.Brand>
          <Nav className="mr-auto">

          </Nav>
          <AuthProvider />
        </Navbar>
        <div className="ChatAppContent">
        {
          this.props.isAuthenticated ?
            <Chat />
            :
            <>
              <h1>Welcome to the chat App!</h1>
              <p>Login to start chatting.</p>
            </>
        }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store: IAppStore): IAppProps => {
  return  { isAuthenticated: store.auth.isAuthenticated?true:false };
} 

export default connect(mapStateToProps)(App);
