import './App.css'
import bgTexture from './assets/hardboard2.jpg'
import Commands from './compononets/Commands'
import StoryTimeline from './compononets/StoryTimeline'
import { sanityClient } from '../client'
import { useState, useEffect, useCallback, useRef } from 'react'
import JumboAlert from './compononets/jumboAlert'
import { motion, useInView } from 'framer-motion'


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
  const [InnerHeight, setInnerHeight] = useState(0)
  const [chromeMobDetected, setChromeMobDetected] = useState(false)
  const [savePointCounter, setSavePointCounter] = useState(0)

  const fullscreenChecker = useRef(null)
  const checkinview = useInView(fullscreenChecker)

  // ARRAY SIMULATING DATA STORED IN THE DATABASE FOR THE STORY TIMELINE
  useEffect(()=>{
    // if(innerWidth < 600){
    //   setJumboAlert(true)
    // }
    // if(innerWidth < 1024){
    //   window.matchMedia("(orientation: portrait)").addEventListener("change", e => {
    //     const portrait = e.matches;
    
    //     if (portrait) {
    //         setJumboAlert(true)
    //     } else {
    //         setJumboAlert(false)
    //     }
    // });
    // }
    

    sanityClient.fetch(`*[_type == "plotPoints"]`).then((data)=> {setPoints(data)});

    if(innerWidth<1024){
      document.querySelector('.overallParent').addEventListener('scroll', scroll)
    }
  }, [])

  useEffect(()=>{
    if(!jumboAlert){
      window.scrollTo(0,0)
    }
  }, [jumboAlert])

  const handleScreenResize = useCallback(()=>{
    if(innerWidth < 800){
      setJumboAlert(true)
    }else{
      setJumboAlert(false)
    }
  }, [])

  
  const scroll = useCallback(()=>{

    if(document.querySelector('.overallParent').scrollTop < 2){
      document.querySelector('.header').style.transform = 'translateY(0)'
      document.querySelector('.overallParent').style.top = '50px'
    }
    if(document.querySelector('.overallParent').scrollTop > 2){
      document.querySelector('.header').style.transform = 'translateY(-100%)'
      document.querySelector('.overallParent').style.top = '0px'
    }

  }, [])

  // useEffect(()=>{
  //   if(checkinview){
      
  //       document.querySelector('.overallParent').style.position = 'fixed'
  //       document.querySelector('.overallParent').style.height = '100vh'
      
      
  //   }
  //   if(!checkinview){
      
  //       document.querySelector('.overallParent').style.position = 'absolute'
  //       document.querySelector('.overallParent').style.height = 'auto'
      
      
     
  //   }
  // }, [checkinview])


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

      {/* MODES AND COMMANDS  ///////////////////////////////////////////////// */}
      <Commands setTracking={setTracking} track={track} setMidPoint={setMidPoint} 
      setPoints={setPoints} plotPointDetails={plotPointDetails} savePoints={savePoints}/>

      
      
      {/* OVERALL PARENT ////////////////////////////////////////////////////////// */}
      <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.3, delay: 0.8}} 
      className='overallParent duration-[0.3s] w-[100vw] h-[92vh] lg:h-[auto] overflow-scroll fixed lg:absolute z-[1] top-[50px] lg:top-[70px] left-0 bg-inherit'
      >

        {/* STORYTIMELINE MODE  //////////////////////////////////////////////////// */}
          <StoryTimeline plotPointDetails={plotPointDetails} mouseTracking={mouseTracking} 
          entryCounter={entryCounter} setCounter={setCounter} midPoint={midPoint} newPoints={newPoints} setTracking={setTracking} 
          setMidPoint={setMidPoint} track={track} deletePoint={deletePoint} updatePoint={updatePoint} mouseX={mouseX} mouseY={mouseY}/>

        {/* BACKGROUND  ///////////////////////////////////////////////////////// */}
          <motion.div className='zoom bgImage w-[1200px] h-[1000px] mx-auto' style={{backgroundImage: `url(${bgTexture})`, 
          backgroundSize: '550px 643px', backgroundRepeat: 'repeat'}}>
          
          </motion.div>
  
      </motion.div>

      {/* <footer className='w-screen h-[]'>

      </footer> */}
    </>
  )
}

export default App
