import { createSlice } from "@reduxjs/toolkit";

export const producerSlice = createSlice({
    name:'producer',
    initialState:{
        lastid:1,
        producers:[]
    },
    reducers:{
        updateproducers:(state,action)=>{
            const {producers} = action.payload;
            for(let i=state.lastid;i<=producers.length;i++){
                state.producers.push(producers[i-1]);
            }
            state.lastid = producers.length+1;
        }
    }
})
export const { updateproducers } = producerSlice.actions;

export default producerSlice.reducer;