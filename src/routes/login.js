import Container from 'react-bootstrap/Container';
import {Link} from 'react-router-dom';
import { Formik, Form,useField } from 'formik';
import * as Yup from 'yup';
import Button from 'react-bootstrap/Button';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import Row from 'react-bootstrap/Row';
import {errorStyles,linkstyles} from '../styles.js';
import { useNavigate } from "react-router-dom";
import React, { useState,useEffect } from 'react';
import Loader from './components/loadingpage';


function Login(props) {
    const nav = useNavigate();
    const socket = props.socket;
    const [isSubmitting,setSubmitting] = useState(false);

    useEffect(()=>{
        socket.emit('checkauth',response=>{ 
            if(response.status === 'success')
                nav("/");
        });
        socket.on('session',({sessionId,username})=>{
            socket.auth = {sessionId};
            localStorage.setItem('session',JSON.stringify({sessionId,username}));
        });
        return ()=>{
            socket.off('session');
        }
    },[nav,socket]);

    

    const TextInput = ({label,...props})=>{
        const [field,meta] = useField(props);
        return(
            <FormGroup as={Row} className="mb-4">
                <FormLabel style={{fontWeight:'bold'}}htmlFor={props.id || props.name}>{label}</FormLabel>
                <FormControl className='p-2'{...field}{...props} />
                {meta.touched && meta.error ?(
                    <div className="error text-wrap" style={errorStyles}>{"*"+meta.error}</div> 
                    ): null}
            </FormGroup>
            );
    }
    

    const LoginForm = (props)=>{
            
        return(
            <Formik
                initialValues={{
                    email:'',
                    password:''
                }}
    
                validationSchema = {Yup.object({
                    email: Yup.string()
                        .email("Please enter a valid email address")
                        .required("Mandatory Field"),
                    password: Yup.string()
                    .required('Please Enter your password')
                    .matches(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"),
                    "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
                    )
                })}
                    onSubmit={(values)=>{
                        setTimeout(()=>{
                                socket.emit('login',values,response=>{
                                    if(response.status === 'error'){
                                        alert(response.message);
                                    }else if(response.status==='success'){
                                        nav("/");
                                    }
                                });
                        },400);
                    }}
            >
                <Form>  
                    <TextInput
                        label="Email"
                        name="email"
                        id="email"
                        placeholder="Enter Your Email ID"
                        type="email"
                    />
                    <TextInput
                        label="Password"
                        name="password"
                        id="password"
                        placeholder="Enter Your Password"
                        type="password"
                    />
                    <div className="d-grid mt-5 mb-2 col-6 mx-auto gap-2">
                        <Button variant="primary" size="lg" type="submit" disabled={isSubmitting}>Login</Button>
                    </div>
                </Form> 
            </Formik>
        )
    }

    if(isSubmitting)
    {
    return(
        <Loader />
        )
    }else{
    return (
        <Container className="d-flex vh-100 align-items-center justify-content-center p-3">
            <div className="d-flex flex-column col-lg-5 gap-4 align-items-center shadow p-5 mb-5 bg-white rounded ">
                <h1>Login</h1>
                <LoginForm socket={props.socket}/>
                <Link to="/signup" className="d-grid text-right" style={linkstyles}>Don't have an account?  Click Here to sign up</Link>
            </div>
        </Container>
        );
    }
}

export default Login;