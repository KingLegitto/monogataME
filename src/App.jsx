import './App.css'
import bgTexture from './assets/hardboard2.jpg'
import Commands from './compononets/Commands'
import StoryTimeline from './compononets/StoryTimeline'
import { sanityClient } from '../client'
import { useState, useEffect, useCallback } from 'react'
import JumboAlert from './compononets/jumboAlert'
import { motion } from 'framer-motion'


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
  const [savePointCounter, setSavePointCounter] = useState(0)

  // ARRAY SIMULATING DATA STORED IN THE DATABASE FOR THE STORY TIMELINE
  useEffect(()=>{
    if(innerWidth < 600){
      setJumboAlert(true)
    }
    window.matchMedia("(orientation: portrait)").addEventListener("change", e => {
      const portrait = e.matches;
  
      if (portrait) {
          setJumboAlert(true)
      } else {
          setJumboAlert(false)
      }
  });

    sanityClient.fetch(`*[_type == "plotPoints"]`).then((data)=> {setPoints(data)});


    window.addEventListener('scroll', scroll)
    // window.scrollTo(0, 10)
  }, [])

  const handleScreenResize = useCallback(()=>{
    if(innerWidth < 800){
      setJumboAlert(true)
    }else{
      setJumboAlert(false)
    }
  }, [])

  
  const scroll = useCallback(()=>{
    if(!jumboAlert && window.scrollY > 20){
      // console.log('Hurray!!!')
      // document.querySelector('.dummy').style.height = '1vh'
      document.querySelector('.overallParent').style.height = '100vh'
    }

    if(!jumboAlert && window.scrollY < 20){
      // document.querySelector('.dummy').style.height = '150vh'
      document.querySelector('.overallParent').style.height = 'auto'
    }

  }, [])

  // FUNCTION TO KNOW THE POSITION OF THE MOUSE SO AS TO INSERT PLOT POINTS THERE
  const track = useCallback((e)=>{
    setmouseX(e.offsetX)
    setmouseY(e.offsetY)
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
    newPoints.forEach((point)=>{
      sanityClient.create(point).then((res, rej)=>{
        if(res){
          console.log('GREAT. One in the bag!!!')
        }else if(rej){
          alert('OOPS!!!')
        }
        })
    })
    

   }
  //  useEffect(()=>{
  //   if(savePointCounter >= 1 && savePointCounter < newPoints.length){
  //     savePoints()
  //   }
  //  }, [savePointCounter])

  return (
    <>
      {jumboAlert && <JumboAlert />}

      {/* MODES AND COMMANDS  ///////////////////////////////////////////////// */}
      {!jumboAlert && <Commands setTracking={setTracking} track={track} setMidPoint={setMidPoint} 
      setPoints={setPoints} plotPointDetails={plotPointDetails} savePoints={savePoints}/>}

      
      
      
      {!jumboAlert && (<motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.3, delay: 0.8}} 
      className='overallParent w-[100vw] h-[auto] overflow-scroll fixed z-[1] top-[50px] lg:top-[70px] left-0 bg-inherit'>

      {/* STORYTIMELINE MODE  //////////////////////////////////////////////////// */}
        <StoryTimeline plotPointDetails={plotPointDetails} mouseTracking={mouseTracking} 
        entryCounter={entryCounter} setCounter={setCounter} midPoint={midPoint} newPoints={newPoints} setTracking={setTracking} 
        setMidPoint={setMidPoint} track={track} deletePoint={deletePoint} updatePoint={updatePoint} mouseX={mouseX} mouseY={mouseY}/>

      {/* BACKGROUND  ///////////////////////////////////////////////////////// */}
        <div className='zoom bgImage w-[1200px] h-[1000px] mx-auto' style={{backgroundImage: `url(${bgTexture})`, 
        backgroundSize: '550px 643px', backgroundRepeat: 'repeat'}}>
        
        </div>
  
      </motion.div>)}

      {/* DUMMY CONTAINER TO TACKLE MOBILE BROWSER ADDRESS BAR ISSUE*/}
      <div className='w-screen h-[150vh] dummy'>

      </div>

      {/* <footer className='w-screen h-[]'>

      </footer> */}
    </>
  )
}

export default App
