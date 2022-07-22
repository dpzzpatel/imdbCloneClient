//@ts-check
import React, { useState,useEffect, useCallback } from 'react'
import { Button, Container,FormGroup,FormLabel,FormText,FormControl,FormSelect} from 'react-bootstrap';
import * as Yup from 'yup';
import {Formik,Form,useField} from 'formik';
import {Row,Col} from 'react-bootstrap';
import axios from 'axios';
import { updatemovie,movieactors,movieproducer } from '../../features/movies/movieSlice';
import { updateactors } from '../../features/movies/actorSlice';
import { updateproducers } from '../../features/movies/producerSlice';
import { useDispatch, useSelector } from 'react-redux';
import Movie from './movie.js';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import moment from 'moment';



const InlineText = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
      <FormGroup>
        <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
        <FormControl {...field} {...props} />
        <FormText style={{color:'red'}}>
        {meta.touched && meta.error ? (
                        <div className="error">*{meta.error}</div>
                        ) : null}
        </FormText>
      </FormGroup>
    );
  };

const SelectSingle = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return(
        <FormGroup>
            <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
            <FormSelect {...field} {...props} />
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </FormGroup>
    )
}


function Addmovie(props) {
    const socket = props.socket;
    const movie = useSelector(state=>state.movie.movie);
    const actors = useSelector(state=>state.actor.actors);
    // const actors = [{value:'Deep',label:'Deep'}]
    const producers = useSelector(state=>state.producer.producers);
    const actorid = useSelector(state=>state.actor.lastid);
    const producerid = useSelector(state=>state.producer.lastid);
    const [show,setShow] = useState(false);
    const [create,setCreate] = useState("");
    const [isfetching,setIsfetching] = useState(false);
    const dispatch = useDispatch();

    const getactors = useCallback(() => {
        socket.emit('getactors',response=>{
            if(response.status === 'success')
              dispatch(updateactors({actors:response.message})); 
        })},[dispatch,socket])
      const getproducers = useCallback(()=>{
        socket.emit('getproducers',response=>{
            if(response.status === 'success')
              dispatch(updateproducers({producers:response.message})); 
          });
      },[socket,dispatch]);

    useEffect(() => {
        getactors();
        getproducers();
    },[getactors,getproducers]);

    
    const searchMovie = () => {
        return (
          <Row>
            <Col>
                <Formik
                initialValues={{
                    name: '',
                }}
                validationSchema={Yup.object({
                    name: Yup.string().required('Required')
                })}
                onSubmit={(values) => {
                    setIsfetching(true);
                    setTimeout(() => {
                        axios.get(`https://www.omdbapi.com/?apikey=${process.env.REACT_APP_apikey}&t=${values.name}`)
                        .then(function (response) {
                        response.data.Response === 'True'?
                        dispatch(updatemovie({data:response.data}))
                        :
                        dispatch(updatemovie({data:{}}))
                        })
                        .catch(function (error) {
                        dispatch(updatemovie({data:{}}))

                        }).then(function () {
                            setIsfetching(false);
                        });
                    }, 400);
                }}
                >
                <Form className='mt-2'>
                    <InlineText label="Search By Movie Name" name="name" type="text" placeholder="Search for a Movie Name"/>
                    <Button variant='info' className='px-5  mt-3' type="submit">Search</Button>
                </Form>
                </Formik>
            </Col>
            <Col>
                <Formik
                initialValues={{
                    id: '',
                }}
                validationSchema={Yup.object({
                    id: Yup.string().required('Required')
                })}
                onSubmit={(values) => {
                    setIsfetching(true);
                    console.log(JSON.stringify(values));
                    setTimeout(() => {
                        axios.get(`http://www.omdbapi.com/?apikey=ec120c07&i=${values.id}`)
                        .then(function (response) {
                        response.data.Response === 'True'?
                        dispatch(updatemovie({data:response.data}))
                        :
                        dispatch(updatemovie({data:{}}))
                        })
                        .catch(function (error) {
                        dispatch(updatemovie({data:{}}))

                        }).then(function () {
                            setIsfetching(false);
                        });
                    }, 400);
                }}
                >
                <Form className='mt-2'>
                    <InlineText label="Search By IMDb Movie ID" name="id" type="text" placeholder=" Enter IMDb Movie ID"/>
                    <Button variant='info' className='px-5  mt-3' type="submit">Search</Button>
                </Form>
                </Formik>
            </Col>
          </Row>
        );
      };

    const openModal = (ele)=>{
        setCreate(ele);
        setShow(true);
    }
    const handleClose = ()=>{
        document.getElementById('reset').click();
        setShow(false);
    }

    const actorsoptions = ()=>{
        return actors.length >0?
        actors.map(actor=>{
            return {value:actor.id,label:actor.name}
        })
        :
        [{value:'', label:'No options available'}]
    }
    
    const producersoptions = ()=>{
        return producers.length >0?
        producers.map(producer=>{
            return {value:producer.id,label:producer.name}
        })
        :
        [{value:'', label:'No options available'}]
    }

    const handleChange = (selectedOptions)=>{

        dispatch(movieactors({data:selectedOptions.map(option=>option.value)}))
    }
    const handleChange1 = (selectedOptions)=>{
        if(selectedOptions)
            dispatch(movieproducer({data:selectedOptions.value}))
        else
            dispatch(movieproducer({data:null}))
    }

    const addmovie = ()=>{
        if(movie.Actors.length > 0 && movie.Producer){
            socket.emit('addmovie',movie,response=>{
                if(response.status === 'success')
                    alert("Movie added successfully!");
                else
                    alert(response.message);
            })
        }else{
            alert('Actor or Producer not selected!');
        }
    }

  return (
     <Container>
        <>
            {searchMovie()}
            <hr />
            {isfetching?'Searching for movie...':<Movie />}
            <div>
             {typeof movie.Title !=='undefined'?
              (
                <>
                <h2 className='text-center mt-3'>Select Actors and Producer</h2>
                <div className='text-center mt-3'>
                <Button variant='danger' size='lg'  onClick={()=>addmovie()} className='px-3' type="submit">Add Movie</Button>
                </div>
                <Row className="mb-3">
                    <Col>
                        <Select isMulti  options={actorsoptions()} className='mt-3' onChange={handleChange}/>
                        <p className='mt-3'>Actor not in list? <Button onClick={()=>openModal('actor')}>Create actor</Button></p>  
                    </Col>
                    <Col>
                        <Select isClearable options={producersoptions()} className='mt-3' onChange={handleChange1}/>
                        <p className='mt-3'>Producer not in list? <Button onClick={()=>openModal('producer')}>Create Producer</Button></p>  
                    </Col>
                </Row>
                    {/* <Button variant='danger' onClick={()=>setShow(true)}>Add {movie.Title}</Button> */}
                </>
               )
             :null}
            </div>
              <Formik
                initialValues={{
                    name: '',
                    gender:'',
                    dob:'',
                    bio:'',                    
                }}
                validationSchema={Yup.object({
                    name: Yup.string().required("Please enter a name").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
                    gender:Yup.string().oneOf(['Male', 'Female']).required('Please select gender'),
                    dob:Yup.string().test(
                        "dob",
                        "Min age must be 10",
                        value => {
                          return moment().diff(moment(value),'years') >= 10;
                        }
                      ),
                    bio:Yup.string().required('Please Enter a bio')
                })}
                onSubmit={(values,{resetForm}) => {
                    setIsfetching(true);
                    setTimeout(() => {
                        socket.emit('addcrew', values,create==='actor'?actorid:producerid,create,(response)=>{
                            if(response.status === 'success'){
                                alert('Added successfully');
                                create === 'actor'?
                                getactors()
                                :
                                getproducers()
                            }
                            setShow(false);
                            resetForm();
                            setIsfetching(false);
                        })
                    }, 400);
                }}
                onReset ={(values,{ resetForm }) => {
                    setIsfetching(true);
                    setTimeout(() => {
                        setIsfetching(false);
                    }, 400);
                }}
                >
                <Modal show={show} size='lg' onHide={()=>handleClose()} backdrop="static" keyboard={false}>
                    <Form>
                    <Modal.Header closeButton>
                        <Modal.Title>{create==='actor'?'Add Actor':'Add Producer'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Row>
                        <Col>
                            <InlineText label="Name" name="name" type="text" placeholder="Enter Name"/>
                        </Col>
                        <Col>
                            <SelectSingle name="gender" label="Select Gender">
                                <option value="" selected disabled hidden>Choose here</option>
                                <option value='Male'>Male</option>
                                <option value='Female'>Female</option>
                            </SelectSingle>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <InlineText label="Date of Birth" onKeyDown={(e) => e.preventDefault()} name="dob" type="date" min="01-01-1900" max="01-07-2022"  placeholder="Select a date"/> 
                        </Col>
                    </Row>
                    <Row>
                        <InlineText as='textarea' name='bio' label='Bio' />
                    </Row>
                        <Button variant='danger' className='px-3 mt-3 me-2' type="submit" disabled={isfetching}>Add {create==='actor'?'Actor':'Producer'}</Button>
                        <Button id='reset' variant='info' className='px-3 mt-3 ms-2' type="reset" disabled={isfetching}>Reset</Button>
                    </Modal.Body>
                    </Form>
                </Modal>
            </Formik>
        </>
     </Container>
  )
}

export default Addmovie;