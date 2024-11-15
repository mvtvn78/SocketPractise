import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Client from './Client';
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
                {/*your path is seem like parent element */}
                <Route index element={<Client/>}></Route>
                {/* The below specifices path will be render and if your path not in the list
                  , it goes to NOTFOUND Page for you
                */}
                <Route path="admin" element={<App/>}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
