import React, { useEffect, useCallback, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BsFillStarFill } from "react-icons/bs";
import {Formik, Form,useField} from 'formik';
import { Button, Col, Container, Row,FormGroup,FormLabel,FormText,FormControl} from 'react-bootstrap';
import * as Yup from 'yup';
import { Modal } from 'react-bootstrap';
import { updateactors } from '../../features/movies/actorSlice';
import { updateproducers } from '../../features/movies/producerSlice';
import {updateList} from '../../features/movies/movieSlice';
import LoadingPage from './loadingpage';

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

function ScreenListing(props) {
  const socket = props.socket;
  const movieslist = useSelector(state=>state.movie.list);
  const actors = useSelector(state=>state.actor.actors);
  const producers = useSelector(state=>state.producer.producers);
  const [editid,seteditId] = useState(null);
  const [show,setShow] = useState(false);
  const [loading,setLoading] = useState(true);
  const dispatch = useDispatch(); 
  const displaymovies  = () => {
    return movieslist.map((movie, index) => {
      const {imdbID,Title,Released,Runtime,Genre,Actors,Plot,Poster,imdbRating,imdbVotes,Producer,Director} = movie;
      return(
        <Row className="mb-3" key={imdbID}>
          <Col md="auto"><img src={Poster} alt="" /></Col>
          <Col>
            <h4>Title : {Title}</h4>
            <p>{Runtime} | {Genre}</p>
            <p><BsFillStarFill /> {imdbRating}</p>
            <p>{Plot}</p>
            <p><b>Director: {Director} | Stars: {Actors.map(actor => actors[actor-1].name).join(',')}</b></p>
            <p><b>Producer: {producers[Producer-1].name}</b></p>
            <p>Votes:{imdbVotes}</p>
            <p>Released : {Released} </p>
            <Button size='sm' onClick={()=>edit(imdbID)}>Edit</Button>
          </Col>
        </Row>
      )
    })
  }

  const getallmovies = useCallback(()=>{
    socket.emit('getallmovies',response=>{
      if(response.status === 'success')
        dispatch(updateList({list:response.message})); 
    });
  },[socket,dispatch]);
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
      getallmovies();
  },[getactors,getproducers,getallmovies]);

  useEffect(() => {
    if(loading && actors.length >0)
      setLoading(false)
  },[loading,actors.length])

  const edit = (id)=>{
    seteditId(id);
    setShow(true);
  }

  const getinitialvalues = ()=>{
    if(editid===null){
      return null;
    }else{
      const movie = movieslist.find((movie) => movie.imdbID === editid);
      const {imdbID,Title,Released,Runtime,Genre,Actors,Plot,imdbRating,imdbVotes,Producer,Director} = movie;
      const obj = {
        imdbID,
        Title,
        Runtime,
        Genre,
        imdbRating,
        Plot,
        Director,
        Actors,
        Producer,
        imdbVotes,
        Released
      }
      return obj;
    }
  }
  return (
      <Container className="mt-2">
        <div className="d-flex justify-content-between">
          <div><h2>All Movies</h2></div>
        </div>
        <hr />
        <div>
          {loading?<LoadingPage />:displaymovies()}
        </div>
        <Formik
                enableReinitialize={true}
                initialValues={getinitialvalues()}
                validationSchema={Yup.object({
                   Title:Yup.string().required(),
                   Runtime:Yup.string().required(),
                   Genre:Yup.string().required(),
                   imdbRating:Yup.string().required(),
                   Plot:Yup.string().required(),
                   Director:Yup.string().required(),
                   imdbVotes:Yup.string().required(),
                })}
                onSubmit={(values) => {
                    // setIsfetching(true);
                    setTimeout(() => {
                      socket.emit('edit',values,response=>{
                        if(response.status === 'success'){
                          getallmovies();
                          alert('Details updated successfully');
                          setShow(false);
                        }
                        });
                      }, 400);
                }}
                >
                <Modal show={show} fullscreen={true} onHide={()=>setShow(false)} backdrop="static" keyboard={false}>
                    <Form>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Row>
                        <Col>
                          <InlineText name='Title' label='Title' id='Title' />
                        </Col>
                        <Col>
                          <InlineText name='Director' label='Director' id='Director' />
                        </Col>
                        <Col>
                          <InlineText name='Runtime' label='Runtime' id='Runtime' />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <InlineText name='imdbRating' label='imdbRating' id='imdbRating' />
                        </Col>
                        <Col>
                          <InlineText name='Genre' label='Genre' id='Genre' />
                        </Col>
                        <Col>
                          <InlineText name='imdbVotes' label='imdbVotes' id='imdbVotes' />
                        </Col>
                      </Row>
                      <Row>
                        <InlineText name='Plot' label='Plot' id='Plot' />
                      </Row>
                      <Row className='justify-content-center'>
                        <Col xs="auto">
                          <Button className="mt-4" type='Submit'>Submit</Button>
                        </Col>
                      </Row>
                    </Modal.Body>
                    </Form>
                </Modal>
        </Formik>
      </Container>
  )
 
}

export default ScreenListing;