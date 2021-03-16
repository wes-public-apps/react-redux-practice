import React from 'react';
import logo from './logo.svg';
import './App.css';
import Chat from './components/Chat';
import { IAppStore } from './reducers/AppReducer';
import { connect } from 'react-redux';
import AuthProvider from './utils/AuthProvider';
import { Navbar, Nav } from 'react-bootstrap';
import "./App.css";

interface IAppProps {
  isAuthenticated: boolean;
}

interface IAppState{

}

class App extends React.Component<IAppProps,IAppState>{

  constructor(props: IAppProps){ super(props); }

  render(){
    return (
      <>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/">Chat</Navbar.Brand>
          <Nav className="mr-auto">
            <AuthProvider />
          </Nav>
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
      </>
    );
  }
}

//#region Add store items to App
const mapStateToProps = (store: IAppStore): IAppProps => {
  return  { isAuthenticated: store.auth.isAuthenticated?true:false };
} 
//#endregion

export default connect(mapStateToProps)(App);
