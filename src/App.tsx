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
import { setSectionTracker, setPlotTracker, emptyTrackers, setUserData, setProjectData } from './redux/reduxStates.js'
import Lottie from 'lottie-react'
import testAnimation from './assets/animations/bodyMovinTest.json'

export const ZoomContext = createContext<any>(null)

function App() {
    const [mouseTracking, setTracking] = useState(false)
    const [mouseX, setmouseX] = useState<number>()
    const [mouseY, setmouseY] = useState<number>()
    const [midPoint, setMidPoint] = useState(false)
    const [updater, setUpdater] = useState(true)
    const [points, setPoints] = useState<any>(null)
    const [showPoints, setShowPoints] = useState(true)
    const [storyTimeline, setStoryTimeline] = useState(true)
    const [characterMode, setCharacterMode] = useState(false)

    const client = useSelector((state: any)=> state.overallStates)
    const dispatch = useDispatch()

    async function fetchPoints(){
        const fetchedData: any = await sanityClient.fetch(`*[_type == "users" && username == "Legitto"][0]`)
        let jsonData = fetchedData.project1
        jsonData = JSON.parse(jsonData)
        dispatch(setUserData(fetchedData))
        dispatch(setProjectData({all: jsonData}))
        setTrackers([...jsonData.points])
        setPoints([...jsonData.points])
    }

    function setTrackers(data: any){
        dispatch(emptyTrackers())
        let entries = data.filter((member: any)=>(member.type == 'section'))
        entries.forEach((entry: any) => {
        dispatch(setSectionTracker({id: entry._id, yPos: entry.y}))
        });
        
        entries = data.filter((member: any)=>(member.type == 'plot'))
        entries.forEach((entry: any)=> {
        dispatch(setPlotTracker({id: entry._id, xPos: entry.x, yPos: entry.y, isChild: false}))
        })
    }
  
    useEffect(()=>{
        // INITIAL FETCH FROM SANITY
        if(!points){
            fetchPoints()
        }

        // setTimeout(() => {
        //     setJumboAlert(true)
        // }, 3000);
    }, [])

    const handleScreenResize = useCallback(()=>{
        
    }, [])

    const [selectionArea, setSelectionArea] = useState(false)
    const [collapseShiftCorrect, setCollapseShiftCorrect] = useState([0, false])
    const [removeCsc, setRemoveCsc] = useState([0,false])
    const [childCarryTrigger, setChildCarryTrigger] = useState(true)
    const [currentCollapseInstigator, setCurrentCollapseInstigator] = useState(client.workableArea.height)
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
        else if(e.offsetX % 100 < 50){
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
        else if(e.offsetY % 100 < 50){
            setmouseY(cY)
        }else{
            setmouseY(cY + 100)
        }
    }, [])

    function updatePoint(data : any){
        let returnBasket : any

        const keys = Object.keys(data || {})

        keys.forEach((key)=>{
            if(key === 'bg'){
               let newArr = points.map((item: any)=>{
                    let check = data.id.find((id: string)=>(item._id === id))
                    if(check){
                        return {...item, bg: data.bg}
                    }
                    return item;
                })
                setPoints(newArr)
            }

            if(key === 'children'){
                let check : any;
                let newArr = points.map((item: any)=>{
                    if(item._id == data.id){
                        return {...item, children: [...data.children], 
                            childCarryStart: data.carryStart }
                    }
                    check = data.subjectToMove.find((id: string)=>(item._id === id))
                    if(check){
                        return {...item, y: item.y + data.collapseDisplacement}
                    }
                    return item;
                })
                setPoints(newArr)
            }

            if(key === 'carryDisplacement'){
                let newPositions : any = []
                let trackingHeight : number;
                let newArr = points.map((item: any)=>{
                    // Remove children log from parent
                    if(item._id == data.parentID){
                        return {...item, children: null}
                    }
                    // Move the children to where the parent currently is
                    let check = data.id.find((id: string)=>(item._id === id))
                    if(check){
                        client.plotTracker.forEach((entry : any) => {
                            if(entry.id == check){
                                trackingHeight = entry.yPos
                            }
                        })
                        newPositions.push(trackingHeight + data.carryDisplacement)
                        return {...item, y: item.y + data.carryDisplacement}
                    }else{
                        return item;
                    }
                })
                returnBasket = {newPositions: newPositions, newArr: newArr}
            }

            if(key === 'uncollapseDisplacement'){
                let newArr = data.arr.map((item: any)=>{
                    let check = data.id.find((id: string)=>(item._id === id))
                    if(check){
                        return {...item, y: item.y + data.uncollapseDisplacement}
                    }else{
                        return item;
                    }
                })
                setPoints(newArr)
            }
        })
        return returnBasket
    }

    function deletePoint(keyID: number){
        let listOfPoints = (points.filter((entry: any)=>(entry._id != keyID)))
        setPoints(listOfPoints)
    }

    function savePoints(){
        let data = [...points]
        const modifiedPointsObj = data.map((item)=>{
            return {...item, x: getApparentPositions(item._id, 'x'), y: getApparentPositions(item._id, 'y')}
        })
        dispatch(setProjectData({points: modifiedPointsObj}))
    }

    function getApparentPositions(_id, axis){
        let returnBasket
        client.sectionTracker.forEach((item)=>{
            if(item.id == _id){
                returnBasket = axis=='x'? 500:item.yPos 
            }
        })
        client.plotTracker.forEach((item)=>{
            if(item.id == _id){
                returnBasket = axis=='x'? item.xPos:item.yPos 
            }
        })
        return returnBasket
    }

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
            <div className='w-[200px] h-[100px] absolute' >
            {/* <Lottie animationData={testAnimation} loop/> */}

            </div>

            {/* STORYTIMELINE MODE  //////////////////////////////////////////////////// */}
            {storyTimeline && <StoryTimeline points={points} mouseTracking={mouseTracking} showPoints={showPoints}
            midPoint={midPoint} setPoints={setPoints} setTracking={setTracking} 
            setMidPoint={setMidPoint} track={track} deletePoint={deletePoint} updatePoint={updatePoint} mouseX={mouseX} mouseY={mouseY}/>}

            {/* CHARACTERS MODE */}
            {characterMode && <Characters />}

            {/* BACKGROUND  ///////////////////////////////////////////////////////// */}
            <motion.div className='zoom bgImage mx-auto transform-gpu' style={{backgroundImage: `url(${bgTexture})`, 
            backgroundSize: '550px 643px', backgroundRepeat: 'repeat', height: client.workableArea.height, width: client.workableArea.width}}>
            
            </motion.div>
  
        </motion.div>
        </ZoomContext.Provider>

    </>
    )
    }

export default App
