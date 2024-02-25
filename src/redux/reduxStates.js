import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  workableArea: {width: 1000, height: 1200},
  slider: 50,
  characters: [
    {name: 'Madara Uchiha', popularName: '', dob: '24 Dec', age: '', height: '179', weight: '71.3', portrait: ''},
    {name: 'Kurama', popularName: 'Nine tails fox', dob: '', age: '', height: '', weight: '', portrait: ''},
    {name: 'Saitama', popularName: '', dob: '', age: '', height: '', weight: '', portrait: ''},
    
]
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
    },

    addCharacters: (state, action) => {
      state.characters.push(action.payload)
    },

    updateCharacters: (state, action) => {
      // state.characters.push(action.payload)
    },

    deleteCharacters: (state, action) => {

      state.characters = state.characters.filter((item)=>(item.name != action.payload))
    },

    placeImage: (state, action) => {
      // characters[num].portrait = url
      state.characters[action.payload[0]].portrait = action.payload[1]
    }
  },
})

// Action creators are generated for each case reducer function
export const { updateSlider, handleZoom, updateCharacters, addCharacters, deleteCharacters, placeImage } = reduxSlice.actions

export default reduxSlice.reducer