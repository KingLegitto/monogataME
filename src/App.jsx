import './App.css'
import bgTexture from './assets/hardboard2.jpg'
import Commands from './compononets/Commands'
import StoryTimeline from './compononets/StoryTimeline'
import { sanityClient } from '../client'
import { useState, useEffect, useCallback } from 'react'
import JumboAlert from './compononets/jumboAlert'


function App() {
  const [mouseTracking, setTracking] = useState(false)
  const [mouseX, setmouseX] = useState('')
  const [mouseY, setmouseY] = useState('')
  const [midPoint, setMidPoint] = useState(false)
  const [updater, setUpdater] = useState(true)
  const [plotPointDetails, setPoints] = useState([])
  const [entryCounter, setCounter] = useState(0)
  const [newPoints, setNewPoints] = useState([])
  const [jumboAlert, setJumboAlert] = useState(false)

  // ARRAY SIMULATING DATA STORED IN THE DATABASE FOR THE STORY TIMELINE
  useEffect(()=>{
    if(innerWidth < 800){
      setJumboAlert(true)
    }
    window.addEventListener('resize', handleScreenResize)

    sanityClient.fetch(`*[_type == "plotPoints"]`).then((data)=> {setPoints(data)})
    // console.log(import.meta.env.VITE_SANITY_AUTH_TOKEN)
  }, [])

  const handleScreenResize = useCallback(()=>{
    if(innerWidth < 800){
      setJumboAlert(true)
    }else{
      setJumboAlert(false)
    }
  }, [])

  // FUNCTION TO KNOW THE POSITION OF THE MOUSE SO AS TO INSERT PLOT POINTS THERE
  const track = useCallback((e)=>{
    setmouseX(e.pageX)
    setmouseY(e.pageY)
  }, [])

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
      {jumboAlert && <JumboAlert />}

      {/* MODES AND COMMANDS  ///////////////////////////////////////////////// */}
      {!jumboAlert && <Commands setTracking={setTracking} track={track} setMidPoint={setMidPoint} setPoints={setPoints} savePoints={savePoints}/>}

      {/* STORYTIMELINE MODE  //////////////////////////////////////////////////// */}
      {!jumboAlert && <StoryTimeline plotPointDetails={plotPointDetails} mouseTracking={mouseTracking} entryCounter={entryCounter} setCounter={setCounter} midPoint={midPoint}
      newPoints={newPoints} setTracking={setTracking} setMidPoint={setMidPoint} track={track} deletePoint={deletePoint} updatePoint={updatePoint} mouseX={mouseX} mouseY={mouseY}/>}

      {/* BACKGROUND  ///////////////////////////////////////////////////////// */}
      {!jumboAlert && <div className='w-[88vw] h-[150vh] absolute right-0 top-[12vh]' style={{backgroundImage: `url(${bgTexture})`, 
        backgroundSize: '550px 643px', backgroundRepeat: 'repeat'}}>
        
      </div>}
    </>
  )
}

export default App
