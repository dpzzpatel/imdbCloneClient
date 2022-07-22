import { createSlice } from "@reduxjs/toolkit";


export const movieSlice = createSlice({
    name:'movie',
    initialState:{
        movie:{},
        lastid:1,
        list:[]
    },
    reducers:{
        updateList:(state,action)=>{
            const {list} = action.payload;
           state.list = list;
        },
        updatemovie:(state,action)=>{
            const {data} = action.payload;
            data.Actors = [];
            state.movie = data;
        },
        movieactors:(state,action)=>{
            const {data} = action.payload;
            state.movie.Actors = data;
        },
        movieproducer:(state,action)=>{
            const {data} = action.payload;
            state.movie.Producer = data;
        }
    }
})
export const { updateList,updatemovie,movieactors,movieproducer } = movieSlice.actions;

export default movieSlice.reducer;