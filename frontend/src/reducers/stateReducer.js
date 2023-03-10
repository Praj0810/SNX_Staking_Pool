import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    NeoTokenAbi :"",
    RewardTokenAbi: "",
    StakingPoolAbi: "",
    NeoTokenAddress: "",
    RewardTokenAddress: "",
    StakingPoolAddress: ""
}

const tokenReducer = createSlice({
    name: "AbiState",
    initialState,
    reducers:{
        updateAbi:(state, action) => {
            state.NeoTokenAbi = action.payload.NeoTokenAbi;
            state.RewardTokenAbi = action.payload.RewardTokenAbi;
            state.StakingPoolAbi = action.payload.StakingPoolAbi;
            state.NeoTokenAddress = action.payload.NeoTokenAddress;
            state.RewardTokenAddress = action.payload.RewardTokenAddress;
            state.StakingPoolAddress = action.payload.StakingPoolAddress;
        }
    }
});

export const {updateAbi} = tokenReducer.actions;

export default tokenReducer.reducer;

