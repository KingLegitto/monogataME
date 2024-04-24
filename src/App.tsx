import './App.css'
// @ts-ignore
import bgTexture from './assets/hardboard2.jpg'
import Commands from './compononets/Commands'
import StoryTimeline from './compononets/StoryTimeline'
import { sanityClient } from '../client'
import { useState, useEffect, useCallback, useRef, Children } from 'react'
import JumboAlert from './compononets/jumboAlert'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import React, {createContext} from "react";
import Characters from './compononets/Characters'
import { useDispatch, useSelector } from 'react-redux'
import { setSectionTracker, setPlotTracker, emptyTrackers, updateTracker } from './redux/reduxStates.js'

export const ZoomContext = createContext<any>(null)


function App() {
    const [mouseTracking, setTracking] = useState(false)
    const [mouseX, setmouseX] = useState<number>()
    const [mouseY, setmouseY] = useState<number>()
    const [midPoint, setMidPoint] = useState(false)
    const [updater, setUpdater] = useState(true)
    const [points, setPoints] = useState<any>([])
    const [entryCounter, setCounter] = useState(1)
    const [newPoints, setNewPoints] = useState([])
    const [savePointCounter, setSavePointCounter] = useState(0)
    const [jumboAlert, setJumboAlert] = useState(false)
    
    const [showPoints, setShowPoints] = useState(true)
    const [storyTimeline, setStoryTimeline] = useState(true)
    const [characterMode, setCharacterMode] = useState(false)

    const fullscreenChecker = useRef(null)
    const checkinview = useInView(fullscreenChecker)

    const { workableArea, sectionTracker, plotTracker } = useSelector((state: any)=> state.overallStates)
    const dispatch = useDispatch()
  
    useEffect(()=>{
        // INITIAL FETCH FROM SANITY
        async function fetchPoints(){
            let data = await sanityClient.fetch(`*[_type == "points"]`)
            setPoints(data)
        }
        fetchPoints()
        

        
        // setTimeout(() => {
        //     setJumboAlert(true)
        // }, 3000);
    }, [])

    useEffect(()=>{
        dispatch(emptyTrackers())

        let entries = points.filter((member: any)=>(member.type == 'section'))
        entries.forEach((entry: any) => {
          dispatch(setSectionTracker({id: entry._id, yPos: entry.y}))
        });
        
        entries = points.filter((member: any)=>(member.type == 'plot'))
        entries.forEach((entry: any)=> {
          dispatch(setPlotTracker({id: entry._id, xPos: entry.x, yPos: entry.y, isChild: false}))
        })
        
    }, [points])

    const handleScreenResize = useCallback(()=>{
        
    }, [])

    // useEffect(()=>{
    //     if(storyTimeline){
    //         setCharacterMode(false)
    //     }
    //     if(characterMode){
    //         setStoryTimeline(false)
    //     }
    // }, [storyTimeline, characterMode])


    const [selectionArea, setSelectionArea] = useState(false)
    const [collapseShiftCorrect, setCollapseShiftCorrect] = useState([0, false])
    const [removeCsc, setRemoveCsc] = useState([0,false])
    const [childCarryTrigger, setChildCarryTrigger] = useState(true)
    const [currentCollapseInstigator, setCurrentCollapseInstigator] = useState(workableArea.height)
    const [bgOverlay, setBgOverlay] = useState(true)
    // /////////////////////////////////////////////////////////////////


    useEffect(()=>{
        setUpdater(!updater)
    }, [innerHeight])


    // FUNCTION TO KNOW THE POSITION OF THE MOUSE SO AS TO INSERT PLOT POINTS PRECISELY
    // COMPLEX LOGIC TO ENSURE NEW POINTS ARE INSERTED IN ACCORDANCE WITH THE GRID SYSTEM
    const track = useCallback((e)=>{
        // LOGIC FOR X AXIS
        let nX = Math.floor(e.offsetX / 100)
        let cX = nX*100
        if(e.offsetX%100 == 0){
            setmouseX(cX)
        }
        else if(e.offsetX%100 < 50){
            setmouseX(cX)
        }else{
            setmouseX(cX + 100)
        }

        // LOGIC FOR Y AXIS
        let nY = Math.floor(e.offsetY / 100)
        let cY = nY*100
        if(e.offsetY%100 == 0){
            setmouseY(cY)
        }
        else if(e.offsetY%100 < 50){
            setmouseY(cY)
        }else{
            setmouseY(cY + 100)
        }
    }, [])

    function updatePoint(keyID: any, bg: string, child: string, childCarryStart: number, carriedPlotPos: number){
        let returnBasket : any
        if(bg != undefined){
        points.forEach((entry: any)=>{if(entry._id == keyID){entry.bg = bg}});
        setUpdater(!updater);
        }
        
        if(bg == undefined){
        setUpdater(!updater)
        }

        if(child){
            points.forEach((entry: any)=>{if(entry._id == keyID){
                entry.children = [...child]
            }});
            console.log(points)
        }

        if(childCarryStart != undefined){
            points.forEach((entry: any)=>{if(entry._id == keyID){
                entry.childCarryStart = childCarryStart
            }});
        }

        if(carriedPlotPos != undefined){
            points.forEach((entry: any)=>{if(entry._id == keyID){
                entry.y = entry.y + carriedPlotPos
            }});
            sectionTracker.forEach((entry: any)=>{if(entry.id == keyID){
                dispatch(updateTracker({type: 'section', keyID: keyID, newYPos: entry.yPos + carriedPlotPos}))
            }});
            plotTracker.forEach((entry: any)=>{if(entry.id == keyID){
                dispatch(updateTracker({type: 'plot', keyID: keyID, newYPos: entry.yPos + carriedPlotPos}))
                returnBasket = (entry.yPos + carriedPlotPos)
            }});
        }
        return returnBasket
    }

    function deletePoint(keyID: number){
        let listOfPoints = (points.filter((entry: any)=>(entry._id != keyID)))
        setPoints(listOfPoints)
        
    }

    function savePoints(){
        newPoints.forEach((point: any)=>{
        sanityClient.create(point)
        // .then((res, rej)=>{
        //     if(res){
        //     console.log('GREAT. One in the bag!!!')
        //     }else if(rej){
        //     alert('OOPS!!!')
        //     }
        //     })
        })
        

    }
    //  useEffect(()=>{
    //   if(savePointCounter >= 1 && savePointCounter < newPoints.length){
    //     savePoints()
    //   }
    //  }, [savePointCounter])

  return (
    <>
        <ZoomContext.Provider value={{selectionArea, setSelectionArea, 
            collapseShiftCorrect, setCollapseShiftCorrect, removeCsc, setRemoveCsc, childCarryTrigger, setChildCarryTrigger, 
            currentCollapseInstigator, setCurrentCollapseInstigator, setBgOverlay}}>
        {/* ALERTS */}
        <AnimatePresence>
        {/* {jumboAlert && <JumboAlert setJumboAlert={setJumboAlert} jumboAlert={jumboAlert} setBgOverlay={setBgOverlay} bgOverlay={bgOverlay}
        setShowPoints={setShowPoints} />} */}
        </AnimatePresence>
        
        <AnimatePresence>
        {/* {bgOverlay && (<motion.div exit={{opacity: 0, transition: {delay: 0.5, duration: 0.5}}} initial={{opacity: 0}} animate={{opacity: 0.6}} transition={{duration: 1, delay: 2}} className='bg-black fixed w-screen h-screen z-[99]'>

        </motion.div>)} */}
        </AnimatePresence>
        
        
        {/* MODES AND COMMANDS  ///////////////////////////////////////////////// */}
        <Commands setTracking={setTracking} track={track} setMidPoint={setMidPoint} 
        setPoints={setPoints} savePoints={savePoints} 
        characterMode={characterMode} setCharacterMode={setCharacterMode}
        storyTimeline={storyTimeline} setStoryTimeline={setStoryTimeline}/>

        
        
        {/* OVERALL PARENT ////////////////////////////////////////////////////////// */}
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.3, delay: 0.8}} style={{height: innerHeight-5}}
        className='overallParent duration-[0.5s] w-[100vw] lg:h-[100vh] overflow-scroll fixed z-[1] top-[50px] lg:top-[70px]  left-0 bg-inherit'
        >

            {/* STORYTIMELINE MODE  //////////////////////////////////////////////////// */}
            {storyTimeline && <StoryTimeline points={points} mouseTracking={mouseTracking} showPoints={showPoints}
            entryCounter={entryCounter} setCounter={setCounter} midPoint={midPoint} newPoints={newPoints} setPoints={setPoints} setTracking={setTracking} 
            setMidPoint={setMidPoint} track={track} deletePoint={deletePoint} updatePoint={updatePoint} mouseX={mouseX} mouseY={mouseY}/>}

            {/* CHARACTERS MODE */}
            {characterMode && <Characters />}

            {/* BACKGROUND  ///////////////////////////////////////////////////////// */}
            <motion.div className='zoom bgImage mx-auto transform-gpu' style={{backgroundImage: `url(${bgTexture})`, 
            backgroundSize: '550px 643px', backgroundRepeat: 'repeat', height: workableArea.height, width: workableArea.width}}>
            
            </motion.div>
  
        </motion.div>
        </ZoomContext.Provider>

    </>
    )
    }

export default App
