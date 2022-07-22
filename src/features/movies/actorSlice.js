import { createSlice } from "@reduxjs/toolkit";


export const actorSlice = createSlice({
    name:'actor',
    initialState:{
        lastid:1,
        actors:[]
    },
    reducers:{
        updateactors:(state,action)=>{
            const {actors} = action.payload;
            for(let i=state.lastid;i<=actors.length;i++){
                state.actors.push(actors[i-1]);
            }
            state.lastid = actors.length+1;
        }
    }
})
export const { updateactors } = actorSlice.actions;

export default actorSlice.reducer;