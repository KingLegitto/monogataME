import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  workableArea: {width: 1000, height: 1200},
  slider: 50,
}

export const reduxSlice = createSlice({
  name: 'overallStates',
  initialState,
  reducers: {
    
    handleZoom: (state, action) => {
        state.slider = action.payload
        document.querySelector('.zoom').style.transform = `scale3d(${action.payload*2}%, ${action.payload*2}%, 1)`
        document.querySelector('.pointsParent').style.transform = `scale3d(${action.payload*2}%, ${action.payload*2}%, 1)`
        document.querySelector('.colorHighLow').style.transform = `scale3d(${action.payload*2}%, ${action.payload*2}%, 1)`
        
            let el = document.querySelector('.bgImage')
            switch(action.payload){
                case '50': el.style.borderRadius='0px'; break;
                default: el.style.borderRadius='50px'
            }
    }
  },
})

// Action creators are generated for each case reducer function
export const { updateSlider, handleZoom } = reduxSlice.actions

export default reduxSlice.reducer