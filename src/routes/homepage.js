import React ,{useEffect, useState} from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import NavigationBar from './components/navbar';
import Loader from './components/loadingpage';

function Homepage(props) {
  const nav = useNavigate();
  const location = useLocation();
  const socket = props.socket;
  const [loading,setLoading] = useState(true);

  useEffect(() => {
      socket.emit('checkauth',response=>{ 
        if(response.status === 'success')
            setLoading(false);
        else
            nav("/login");
      });
    

    socket.on('reload',()=>{
      window.location.reload();
    });
    return () => {
      socket.off('reload');
    }
    
  }, [nav,socket])
  
  
  return (
    loading?
    <Loader />
    :
    <>
        <NavigationBar socket={socket}/>
        {location.pathname === '/' ? <div className="vh-100 d-flex justify-content-center align-items-center"> <h1> Welcome</h1></div>:null}
        <Outlet />
    </>
  )
}

export default Homepage;
