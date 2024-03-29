import '../App.css';
import {useState} from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';

import { modeContext, userContext, entertainmentContext } from '../contexts/contexts';
import { Outlet } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Root() {

  // contexts
  const [ mode, setMode ] = useState('movie');
  const [ userData, setUserData ] = useState(JSON.parse(sessionStorage.getItem('loggedUser')));
  const [ entertainmentData, setEntertainmentData ] = useState({});

  return (
    <div className= "app-container">
      <userContext.Provider value={{ userData, setUserData }}>
        <entertainmentContext.Provider value={{ entertainmentData, setEntertainmentData }}>
          <modeContext.Provider value={{ mode, setMode }}>
            <Header />
            <ToastContainer />
            <Outlet />
            <Footer />
          </modeContext.Provider>
        </entertainmentContext.Provider>
      </userContext.Provider>
    </div>
  );


};

export default Root;
