import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import store from './app/store';
import { Provider } from 'react-redux';
import SignUp from './routes/signup';
import Login from './routes/login';
import HomePage from './routes/homepage';
import ScreenListing from './routes/components/screenlisting';
import AddMovie from './routes/components/addmovie';
import { io } from "socket.io-client";

var session = JSON.parse(localStorage.getItem("session"));  
if(session === null)
  session = {sessionId:null}
const socket = io('https://imdbcloneserver.herokuapp.com/',{auth : {sessionId:session.sessionId}});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
              <Route path="/login" element={<Login socket={socket} />} />
              <Route path="/signup" element={<SignUp socket={socket} />} />
              <Route path="/" element={<HomePage socket={socket} />}>
                <Route path="screenlisting" element={<ScreenListing socket={socket}/>} />
                <Route path="addmovie" element={<AddMovie socket={socket} />} />
              </Route>
              <Route path="*" 
              element={ 
                      <main style={{ padding: "1rem" }}>
                      <p>There's nothing here!</p>
                      </main>
                      }
              />
          </Routes>
        </BrowserRouter>
      </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
