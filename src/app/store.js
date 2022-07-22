import { configureStore } from '@reduxjs/toolkit';
import movie from '../features/movies/movieSlice';
import actor from '../features/movies/actorSlice';
import producer from '../features/movies/producerSlice';

export default configureStore({
  reducer: {
    movie:movie,
    actor:actor,
    producer:producer
  }
})