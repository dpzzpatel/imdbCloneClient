import Nav from 'react-bootstrap/Nav';
import {Button,Navbar,Container}  from 'react-bootstrap';

import { FiMenu } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';


function NavigationBar(props) {
  const socket = props.socket;
  const session = JSON.parse(localStorage.getItem("session"));
  const nav = useNavigate();
  const handleClick = (path) => {
    nav(path);
  }
  const logout = ()=>{
      socket.emit('logout',session,response=>{
          if(response.status ===  'success'){
            localStorage.removeItem("session");
              nav('/login');
          }
      });
  }

  return (
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>
            <Button className='mx-2' variant="warning"><strong>IMDb</strong></Button> <FiMenu /> <Navbar.Text style={{verticalAlign: 'middle'}}>Menu</Navbar.Text>
          </Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link><Button onClick={(e)=>handleClick("/screenlisting")}>All Movies</Button></Nav.Link>
            <Nav.Link><Button onClick={(e)=>handleClick("/addmovie")}>Add a new movie</Button></Nav.Link>
            <Nav.Link><Button variant='danger' onClick={()=>logout()}>Logout</Button></Nav.Link>
          </Nav>
        </Container>
      </Navbar>
  );
}

export default NavigationBar;

