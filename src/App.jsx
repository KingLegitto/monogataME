import './App.css'
import bgTexture from './assets/hardboard2.jpg'
import Commands from './compononets/Commands'
import StoryTimeline from './compononets/StoryTimeline'
import { sanityClient } from '../client'
import { useState, useEffect, useCallback, useRef } from 'react'
import JumboAlert from './compononets/jumboAlert'
import { motion, useInView } from 'framer-motion'
import React, {createContext} from "react";

export const ZoomContext = createContext()


function App() {
    const [mouseTracking, setTracking] = useState(false)
    const [mouseX, setmouseX] = useState('')
    const [mouseY, setmouseY] = useState('')
    const [midPoint, setMidPoint] = useState(false)
    const [updater, setUpdater] = useState(true)
    const [points, setPoints] = useState([])
    const [entryCounter, setCounter] = useState(0)
    const [newPoints, setNewPoints] = useState([])
    const [InnerHeight, setInnerHeight] = useState(0)
    const [savePointCounter, setSavePointCounter] = useState(0)

    const fullscreenChecker = useRef(null)
    const checkinview = useInView(fullscreenChecker)

  
    useEffect(()=>{
        // INITIAL FETCH FROM SANITY
        sanityClient.fetch(`*[_type == "points"]`).then((data)=> {setPoints(data)});

        if(innerWidth<1024){
        document.querySelector('.overallParent').addEventListener('scroll', scroll)
        }
    }, [])

    const handleScreenResize = useCallback(()=>{
        
    }, [])

    
    const scroll = useCallback(()=>{

        // BRING HEADER BACK IN VIEW
        if(document.querySelector('.overallParent').scrollTop < 2){
        document.querySelector('.header').style.transform = 'translateY(0)'
        // document.querySelector('.overallParent').style.top = '50px'
        }

        // TAKE HEADER OUT OF VIEW
        if(document.querySelector('.overallParent').scrollTop > 10){
        document.querySelector('.header').style.transform = 'translateY(-100%)'
        document.querySelector('.overallParent').style.top = '0px'
        // document.querySelector('.overallParent').removeEventListener('scroll', scroll)
        }

    }, [])


    // CONTEXT STATES AND FUNCTIONS /////////////////////////////////
    const [slider, setSlider] = useState(50)
    const handleZoom = (value)=>{
        
        document.querySelector('.zoom').style.transform = `scale3d(${value*2}%, ${value*2}%, 1)`
        document.querySelector('.pointsParent').style.transform = `scale3d(${value*2}%, ${value*2}%, 1)`
        document.querySelector('.colorHighLow').style.transform = `scale3d(${value*2}%, ${value*2}%, 1)`
        
            let el = document.querySelector('.bgImage')
            switch(value){
                case '50': el.style.borderRadius='0px'; break;
                default: el.style.borderRadius='30px'
            }
            
        }
    const [selectionArea, setSelectionArea] = useState(false)
    // /////////////////////////////////////////////////////////////////


    // FUNCTION TO KNOW THE POSITION OF THE MOUSE SO AS TO INSERT PLOT POINTS PRECISELY
    const track = useCallback((e)=>{
        setmouseX(e.offsetX)
        setmouseY(e.offsetY)
    }, [])

    function updatePoint(keyID, bg){
        if(bg != undefined){
        points.forEach((entry)=>{if(entry._id == keyID){entry.bg = bg}});
        setUpdater(!updater);
        }
        
        if(bg == undefined){
        setUpdater(!updater)
        }

    }

    function deletePoint(keyID){
        let listOfPoints = (points.filter((entry)=>(entry._id != keyID)))
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
        <ZoomContext.Provider value={{handleZoom, slider, setSlider, selectionArea, setSelectionArea}}>
        {/* MODES AND COMMANDS  ///////////////////////////////////////////////// */}
        <Commands setTracking={setTracking} track={track} setMidPoint={setMidPoint} 
        setPoints={setPoints} points={points} savePoints={savePoints}/>

        
        
        {/* OVERALL PARENT ////////////////////////////////////////////////////////// */}
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.3, delay: 0.8}} 
        className='overallParent duration-[0.5s] w-[100vw] h-[92vh] lg:h-[100vh] overflow-scroll fixed z-[1] top-[50px] lg:top-[70px]  left-0 bg-inherit'
        >

            {/* STORYTIMELINE MODE  //////////////////////////////////////////////////// */}
            <StoryTimeline points={points} mouseTracking={mouseTracking} 
            entryCounter={entryCounter} setCounter={setCounter} midPoint={midPoint} newPoints={newPoints} setTracking={setTracking} 
            setMidPoint={setMidPoint} track={track} deletePoint={deletePoint} updatePoint={updatePoint} mouseX={mouseX} mouseY={mouseY}/>

            {/* BACKGROUND  ///////////////////////////////////////////////////////// */}
            <motion.div className='zoom bgImage w-[1200px] h-[1000px] mx-auto transform-gpu' style={{backgroundImage: `url(${bgTexture})`, 
            backgroundSize: '550px 643px', backgroundRepeat: 'repeat'}}>
            
            </motion.div>
  
        </motion.div>
        </ZoomContext.Provider>

    </>
    )
    }

export default App
