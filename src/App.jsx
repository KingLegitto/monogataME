import { useState, useCallback, useEffect, useRef } from 'react'
import './App.css'
import bgTexture from './assets/hardboard2.jpg'
import PlotElements from './compononets/plotElements'
import Commands from './compononets/Commands'
import { sanityClient } from '../client'

function App() {
  const [mouseTracking, setTracking] = useState(false)
  const [mouseX, setmouseX] = useState('')
  const [mouseY, setmouseY] = useState('')
  const [midPoint, setMidPoint] = useState(false)
  const [updater, setUpdater] = useState(true)
  const plotDragConstraints = useRef(null)
  const [plotPointDetails, setPoints] = useState([])
  const [entryCounter, setCounter] = useState(0)
  const [newPoints, setNewPoints] = useState([])

  // ARRAY SIMULATING DATA STORED IN THE DATABASE FOR THE STORY TIMELINE
  useEffect(()=>{
    sanityClient.fetch(`*[_type == "plotPoints"]`).then((data)=> {setPoints(data)})
    // console.log(import.meta.env.VITE_SANITY_AUTH_TOKEN)
  }, [])


  // const [plotPointDetails, setPoints] = useState([
  //   { x: 765-100, y: 100, details: 'Prologue', bg: '#000000bb', type: 'section'},
  //   { x: 200, y: 100, details: 'Hello there. This is the first.', bg: '#eeeeeee5', type: 'plot'},
  //   { x: 250, y: 220, details: 'This is the second element.', bg: '#eeeeeee5', type: 'plot'},
  //   { x: 500, y: 270, details: 'This is the third element.', bg: '#eeeeeee5', type: 'plot'}
  // ]) 

  // FUNCTION TO KNOW THE POSITION OF THE MOUSE SO AS TO INSERT PLOT POINTS THERE
  const track = useCallback((e)=>{
    setmouseX(e.pageX)
    setmouseY(e.pageY)
  }, [])

  // FUNCTION TO HANDLE ADDING POINTS ON THE BACKGROUND ACCORDING TO THE MOUSE POSITION
   const handleBgClick = ()=>{
    
    if(mouseTracking == true){
      setCounter(entryCounter + 1)
      document.querySelector('.bg').style.cursor = 'default'

      plotPointDetails.push({_id: entryCounter, x: midPoint?midPoint-100:mouseX, y: mouseY, details: '[ Empty... ]',
      bg: midPoint?'#000000bb':'#eeeeeee5', type: midPoint?'section':'plot'})

      newPoints.push({_type: 'plotPoints', x: midPoint?midPoint-100:mouseX, y: mouseY, details: 'Hi there',
      bg: midPoint?'#000000bb':'#eeeeeee5', type: midPoint?'section':'plot'})

      document.querySelector('.bg').removeEventListener('click', track)
      setTracking(false)
      setMidPoint(false)
      // console.log(plotPointDetails)
    }
   }

   function updatePoint(keyID, bg){
    if(bg != undefined){
      plotPointDetails.forEach((entry)=>{if(entry._id == keyID){entry.bg = bg}});
      setUpdater(!updater);
    }
    
    if(bg == undefined){
      setUpdater(!updater)
    }

   }

   function deletePoint(keyID){
    let listOfPoints = (plotPointDetails.filter((entry)=>(entry._id != keyID)))
    setPoints(listOfPoints)
    
   }

   function savePoints(){
    let point = newPoints[0]
    sanityClient.create(point).then((res)=>{alert('Point uploaded')})
   }

  return (
    <>
    {/* COMMANDS, SETTINGS AND OPTIONS */}
    <Commands setTracking={setTracking} track={track} setMidPoint={setMidPoint} setPoints={setPoints} savePoints={savePoints}/>


    {/* BACKGROUND  ///////////////////////////////////////////////////////// */}
    <div ref={plotDragConstraints} className='w-[88vw] h-[150vh] bg absolute right-0 top-[12vh]' style={{backgroundImage: `url(${bgTexture})`, 
      backgroundSize: '550px 643px', backgroundRepeat: 'repeat'}} onClick={handleBgClick}>
        
      </div>

    {/* PLOT POINTS  //////////////////////////////////////////////////////// */}
    {plotPointDetails && plotPointDetails.map((entry)=>{
      return(
            <PlotElements plotDragConstraints={plotDragConstraints} key={entry._id}
            bgColor={entry.bg} x={entry.x} y={entry.y} details={entry.details}
            type={entry.type} deletePoint={deletePoint} updatePoint={updatePoint} keyID={entry._id}/>
      )
      })
    }

      
    </>
  )
}

export default App
