import { useState, useCallback, useEffect, useRef } from 'react'
// import PlotElements from 'PlotElements.jsx'
import PlotElements from './PlotElements.jsx'
import { ZoomContext } from '../App.jsx'
import { useContext } from 'react'
import { AnimatePresence, motion } from 'framer-motion'


const StoryTimeline = ({plotPointDetails, mouseTracking, entryCounter, setCounter, newPoints, setTracking, setMidPoint, track,
deletePoint, updatePoint, midPoint, mouseX, mouseY}) => {
  
  const plotDragConstraints = useRef(null)
  const {setSelectionArea, selectionArea} = useContext(ZoomContext)
  
  // const [editModeLimiter, setEditModeLimiter] = useState(false)
  
  
  // FUNCTION TO HANDLE ADDING POINTS ON THE BACKGROUND ACCORDING TO THE MOUSE POSITION
   const handleBgClick = ()=>{

    if(mouseTracking == true){
      
      // alert('hello')

      setSelectionArea(false)
      setCounter(entryCounter + 1)
      document.querySelector('.bg').style.cursor = 'default'
  
      plotPointDetails.push({_id: entryCounter, x: midPoint?midPoint-90:mouseX, y: mouseY, details: '[ Empty... ]',
      bg: midPoint?'#000000bb':'#eeeeeee5', type: midPoint?'section':'plot'})
      // console.log(plotPointDetails)
      newPoints.push({_type: 'plotPoints', x: midPoint?midPoint-90:mouseX, y: mouseY, details: 'Okay',
      bg: midPoint?'#000000bb':'#eeeeeee5', type: midPoint?'section':'plot'})

      document.querySelector('.bg').removeEventListener('click', track)
      setTracking(false)
      setMidPoint(false)
      // console.log(plotPointDetails)
    }
   }

  return ( 
    <>

    <div className='colorHighLow duration-[0.5s] rounded-[30px] w-[1200px] h-[1000px] absolute z-[6] top-0 left-0 right-0 mx-auto'
    style={{opacity: selectionArea? 1: 0}}>

    </div>
    
    

    {/* CLICKABLE BACKGROUND  ///////////////////////////////////////////////////////// */}
    <div ref={plotDragConstraints} className='bg pointsParent rounded-[30px] w-[1200px] h-[1000px] absolute z-[7] left-0 right-0 mx-auto' onClick={handleBgClick}>
      {/* PLOT POINTS  //////////////////////////////////////////////////////// */}
      {plotPointDetails && plotPointDetails.map((entry)=>{
        return(
              <PlotElements key={entry._id} plotDragConstraints={plotDragConstraints}
              bgColor={entry.bg} x={entry.x} y={entry.y} details={entry.details}
              type={entry.type} deletePoint={deletePoint} updatePoint={updatePoint} keyID={entry._id}/>
        )
        })
      }
    </div>
    

      
    </>

   );
}
 
export default StoryTimeline;