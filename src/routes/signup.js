import Container from 'react-bootstrap/Container';
import {Link} from 'react-router-dom';
import { Formik, Form,useField } from 'formik';
import * as Yup from 'yup';
import Button from 'react-bootstrap/Button';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import Row from 'react-bootstrap/Row';
import {errorStyles,linkstyles} from '../styles';
import React, { useState,useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Loader from './components/loadingpage';



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

function SignUp(props) {
    const nav = useNavigate();
    const socket = props.socket;
    const [iswaiting,setIswaiting] =useState(false);

    useEffect(() => {
        socket.emit('checkauth',response=>{ 
            if(response.status === 'success')
                nav("/");
        });
    },[nav,socket])

    const SignUpForm = (props)=>{
        return(
            <Formik
                initialValues={{
                    firstname:'',
                    lastname:'',
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
                    onSubmit={(values,actions)=>{
                        setTimeout(async()=>{
                            setIswaiting(true);
                            socket.emit('signup',values,(response)=>{
                                alert(response);
                                setIswaiting(false);
                                actions.resetForm();
                            });
                        },400);
                    }}
            >
                <Form>
                <TextInput
                        label="First Name"
                        name="firstname"
                        id="firstname"
                        placeholder="Enter Your First Name"
                        type="text"
                    />  
                    <TextInput
                        label="Last Name"
                        name="lastname"
                        id="lastname"
                        placeholder="Enter Your Last Name"
                        type="text"
                    />
                    <TextInput
                        label="Email"
                        name="email"
                        id="email"
                        placeholder="Enter Your Email Address"
                        type="email"
                        
                    />
                    
                    <TextInput
                        label="Password"
                        name="password"
                        id="password"
                        placeholder="Enter Your Password"
                        type="password"
                    />
                    <div className="d-grid mt-5 col-6 mx-auto">
                        <Button variant="primary" size="lg" type="submit"  disabled={Formik.isSubmitting}>Sign Up</Button>
                    </div>
                </Form> 
            </Formik>
        )
    }

    if(iswaiting)
    {
        return (<Loader />);
    }else{
        return (
            <Container className="d-flex vh-100 align-items-center justify-content-center p-3">
                <div className="d-flex flex-column col-lg-5 gap-4 align-items-center shadow p-5 mb-5 bg-white rounded ">
                    <h1>Sign Up</h1>
                    <SignUpForm socket={props.socket}/>
                    <Link to="/login" className="d-grid text-right" style={linkstyles}>Already signed up?  Click here to login</Link>
                </div>
            </Container>
        );
    }
}

export default SignUp;