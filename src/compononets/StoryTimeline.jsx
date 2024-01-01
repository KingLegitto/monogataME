import { useState, useCallback, useEffect, useRef } from 'react'
// import PlotElements from 'PlotElements.jsx'
import PlotElements from './PlotElements.jsx'

const StoryTimeline = ({plotPointDetails, mouseTracking, entryCounter, setCounter, newPoints, setTracking, setMidPoint, track,
deletePoint, updatePoint, midPoint, mouseX, mouseY}) => {
  
  const plotDragConstraints = useRef(null)

  // FUNCTION TO HANDLE ADDING POINTS ON THE BACKGROUND ACCORDING TO THE MOUSE POSITION
   const handleBgClick = ()=>{
    
    if(mouseTracking == true){
      // alert('hello')
      setCounter(entryCounter + 1)
      document.querySelector('.bg').style.cursor = 'default'

      plotPointDetails.push({_id: entryCounter, x: midPoint?midPoint-100:mouseX, y: mouseY, details: '[ Empty... ]',
      bg: midPoint?'#000000bb':'#eeeeeee5', type: midPoint?'section':'plot'})
      // console.log(plotPointDetails)
      newPoints.push({_type: 'plotPoints', x: midPoint?midPoint-100:mouseX, y: mouseY, details: '[ Empty... ]',
      bg: midPoint?'#000000bb':'#eeeeeee5', type: midPoint?'section':'plot'})

      document.querySelector('.bg').removeEventListener('click', track)
      setTracking(false)
      setMidPoint(false)
      // console.log(plotPointDetails)
    }
   }

  return ( 
    <>

    {/* CLICKABLE BACKGROUND  ///////////////////////////////////////////////////////// */}
    <section ref={plotDragConstraints} className='w-[1200px] h-[1000px] absolute top-[0px] z-[5] left-0 right-0 mx-auto'>
        
    </section>
    
    <div className='bg pointsParent w-[1200px] h-[1000px] p-0 absolute z-[6] left-0 right-0 mx-auto' onClick={handleBgClick}>
      {/* PLOT POINTS  //////////////////////////////////////////////////////// */}
      {plotPointDetails && plotPointDetails.map((entry)=>{
        return(
              <PlotElements plotDragConstraints={plotDragConstraints} key={entry._id}
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