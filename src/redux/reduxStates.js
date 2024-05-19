import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  workableArea: { width: 1000, height: 1200 },
  slider: 50,
  sectionTracker: [],
  plotTracker: [],
  hiddenPoints: [],
  hideTrigger: false,
  characters: [
    {
      name: "Madara Uchiha",
      popularName: "",
      dob: "24 Dec",
      age: "",
      height: "179",
      weight: "71.3",
      portrait: "",
    },
    {
      name: "Kurama",
      popularName: "Nine tails fox",
      dob: "",
      age: "",
      height: "",
      weight: "",
      portrait: "",
    },
    {
      name: "Saitama",
      popularName: "",
      dob: "",
      age: "",
      height: "",
      weight: "",
      portrait: "",
    },
  ],
};

export const reduxSlice = createSlice({
  name: "overallStates",
  initialState,
  reducers: {
    handleZoom: (state, action) => {
      state.slider = action.payload;
      document.querySelector(".zoom").style.transform = `scale3d(${
        action.payload * 2
      }%, ${action.payload * 2}%, 1)`;
      document.querySelector(".pointsParent").style.transform = `scale3d(${
        action.payload * 2
      }%, ${action.payload * 2}%, 1)`;
      document.querySelector(".colorHighLow").style.transform = `scale3d(${
        action.payload * 2
      }%, ${action.payload * 2}%, 1)`;

      let el = document.querySelector(".bgImage");
      switch (action.payload) {
        case "50":
          el.style.borderRadius = "0px";
          break;
        default:
          el.style.borderRadius = "50px";
      }
    },

    setSectionTracker: (state, action) => {
      state.sectionTracker.push(action.payload);
    },

    setPlotTracker: (state, action) => {
      state.plotTracker.push(action.payload);
    },

    updateTracker: (state, action) => {
      let newSectionsData = state.sectionTracker.map((item) => {
            if (action.payload.type == 'section' && action.payload.keyID == item.id) {
              return {...item, yPos: action.payload.newYPos!=undefined
                ? action.payload.newYPos
                : item.yPos}
            }
            return item
          })

        let newPlotsData = state.plotTracker.map((item) => {
            if (action.payload.type == 'plot' && action.payload.keyID == item.id) {
              return {...item, isChild: action.payload.childState!=undefined
                ? action.payload.childState
                : item.isChild, 
                yPos: action.payload.newYPos
                ? action.payload.newYPos
                : item.yPos}
            }
            return item
          });

          state.sectionTracker = newSectionsData
          state.plotTracker = newPlotsData
    },

    emptyTrackers: (state) => {
      state.sectionTracker = [];
      state.plotTracker = [];
    },

    updateHiddenPoints: (state, action) => {
      if(state.hiddenPoints.length < 1){
        state.hiddenPoints = [...action.payload]
      }
      else{
        state.hiddenPoints.push(...action.payload)
      }
      state.hideTrigger = !state.hideTrigger
    },

    removeFromHiddenPoints: (state, action) => {
      

      let newArr = state.hiddenPoints.filter((item)=>(item != action.payload))
      state.hiddenPoints = newArr
      state.hideTrigger = !state.hideTrigger
    },

    addCharacters: (state, action) => {
      state.characters.push(action.payload);
    },

    updateCharacters: (state, action) => {
      // state.characters.push(action.payload)
    },

    deleteCharacters: (state, action) => {
      state.characters = state.characters.filter(
        (item) => item.name != action.payload
      );
    },

    placeImage: (state, action) => {
      // characters[num].portrait = url
      state.characters[action.payload[0]].portrait = action.payload[1];
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateSlider,
  handleZoom,
  setSectionTracker,
  setPlotTracker,
  updateTracker,
  updateHiddenPoints,
  removeFromHiddenPoints,
  emptyTrackers,
  updateCharacters,
  addCharacters,
  deleteCharacters,
  placeImage,
} = reduxSlice.actions;

export default reduxSlice.reducer;
