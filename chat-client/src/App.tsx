import React from 'react';
import logo from './logo.svg';
import './App.css';
import Chat from './components/Chat';

interface IAppProps {

}

interface IAppState{

}

class App extends React.Component<IAppProps,IAppState>{
  render(){
    return <Chat />;
  }
}

export default App;
