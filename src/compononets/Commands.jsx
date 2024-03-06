import { useState, useEffect } from "react"
import { sanityClient } from '../../client'
import { motion } from "framer-motion"
import { MenuRounded } from "@mui/icons-material"
import { ZoomContext } from '../App.tsx'
import { useContext } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { handleZoom, updateCharacters } from "../redux/reduxStates.js"

const Commands = ({setTracking, track, setMidPoint, setPoints, savePoints, characterMode, setCharacterMode,
storyTimeline, setStoryTimeline}) => {
    const [userDetails, setUserDetails] = useState(false)
    const [checkUserEmail, setCheckUserEmail] = useState(false)
    
    const [aside, setAside] = useState(true)
    const [updater, setUpdater] = useState(true)

    const { workableArea, slider, characters } = useSelector((state) => state.overallStates)
    const dispatch = useDispatch()

    const {setSelectionArea} = useContext(ZoomContext)
    

    const handleNewPoint = ()=>{
        setSelectionArea(true)
        document.querySelector('.bg').style.cursor = 'crosshair'
        document.querySelector('.bg').addEventListener('click', track)
        setTracking(true)
    }

    const handleNewSection = ()=>{
        setSelectionArea(true)
        document.querySelector('.bg').style.cursor = 'crosshair'
        let value = (document.querySelector('.bg').offsetWidth)/2
        // alert(value)
        setMidPoint(value)
        document.querySelector('.bg').addEventListener('click', track)
        setTracking(true)
    }

    const hideSideMenu = ()=>{
        document.querySelector('.menuIcon').style.left = `0px`; 
        document.querySelector('.aside').style.left = `0px`;
        document.querySelector('.menuIcon').style.transform = `translate(-50%, -50%) scale(${2-(0/200)})` 
    }

    const handleLogin = ()=>{
        var email = prompt('Type in your email')
        setCheckUserEmail(true)
        // alert(email)
        sanityClient.fetch(`*[_type == "users" && email == "${email}"]`)
        .then((data)=> {setUserDetails(data)})
    }

    // INITIAL AUTO ZOOM IN FOR MOBILE DEVICES
    useEffect(()=>{
        if(innerWidth<1024){
            dispatch(handleZoom(32))
            document.querySelector('.overallParent').scrollTo(workableArea.width / 2 *(0.46), 0)
        }
    }, [])

    useEffect(()=>{
        // alert(userDetails)
            // alert(userDetails[0].username)
            if(userDetails == '' && checkUserEmail == true){
                alert('Could not find user. Check if you got the email right.')
                setCheckUserEmail(false)
            }
            if(userDetails != '' && checkUserEmail == true){
                let user = userDetails[0].username
                alert(`Great! Logged in as ${user}`)
                sanityClient.fetch(`*[_type == "plotPoints" && users == "${user}"]`).then((data)=> {setPoints(data)})
            }
            
        
      }, [userDetails])

      function resetWorkArea(){
        dispatch(handleZoom(50))
        document.querySelector('.zoom').style.transition = '0s'
        
        document.querySelector('.overallParent').scrollTo(0,0)
        document.querySelector('.overallParent').style.overflowX = 'hidden'
        document.querySelector('.bgImage').style.borderRadius='0px'
        
      }

    return ( 
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.3, delay: 0.3}} className="h-auto w-screen">
            <motion.header className="header duration-[0.3s] w-[100vw] h-[50px] lg:h-[70px] grid bg-white fixed top-0 z-[90] justify-between items-center" 
            style={{gridTemplateColumns: innerWidth<500? '1fr 1fr 1fr': '1fr 5fr 1fr'}}>
                <div className="w-[100%] lg:w-[12vw] text-center justify-self-center">
                    
                    {!checkUserEmail && (<button onClick={handleLogin} className="bg-[#ff74c5] text-white px-[10px] py-[5px] rounded-[12px] ">
                        Log in
                    </button>)}
                    
                    {userDetails[0] && (userDetails[0].username)}
                </div>
                <h1 className="text-center text-[25px]">
                    MonogataME
                </h1>
                <div className="w-[100%] lg:w-[12vw] text-center justify-self-center">
                    <button onClick={savePoints} className="bg-[#ff74c5] text-white px-[10px] py-[5px] rounded-[12px] ">Save</button>
                </div>
                
            </motion.header>

            {(aside) && (<motion.aside className="aside translate-x-[-150%] translate-y-[-50%] w-[auto] min-w-[110px] max-w-[200px] h-[35vh] lg:h-[50vh]
             fixed top-[50vh] left-0 z-[45] flex flex-col justify-between duration-[0.3s]">
                
                {/* STORY TIMELINE ////////////////////////////////////////////////////// */}
                <motion.button whileTap={{scale: 0.8}} className=" lg:hover:scale-[1.05]" onClick={()=>{setStoryTimeline(true), setCharacterMode(false), 
                document.querySelector('.overallParent').style.overflowX = 'scroll', hideSideMenu()}}

                style={{backgroundColor: storyTimeline? '#ff74c5':'#eeeeeee5', color: storyTimeline? 'white':'black'}}>
                    Story timeline
                </motion.button>
                    {storyTimeline &&(<>
                    <motion.button whileTap={{scale: 0.8}} style={{background: '#000000bb'}} className=" lg:hover:scale-[1.05] text-white" onClick={()=>{handleNewPoint(); hideSideMenu()}}>
                        Add new point
                    </motion.button>
                    <motion.button whileTap={{scale: 0.8}} style={{background: '#000000bb'}} className=" lg:hover:scale-[1.05] text-white" onClick={()=>{handleNewSection(); hideSideMenu()}}>
                        Add section point
                    </motion.button>
                    </>)}
                    
                
                {/* CHARACTER MODE /////////////////////////////////////////////////////// */}
                <motion.button whileTap={{scale: 0.8}} className=" lg:hover:scale-[1.05]" 
                onClick={()=>{setCharacterMode(true), setStoryTimeline(false), resetWorkArea(), hideSideMenu()}}
                style={{backgroundColor: characterMode? '#ff74c5':'#eeeeeee5', color: characterMode? 'white':'black'}}>
                    Characters
                </motion.button>
                    {characterMode && (<motion.button whileTap={{scale: 0.8}} style={{background: '#000000bb'}} className=" lg:hover:scale-[1.05] text-white"
                    onClick={()=>{hideSideMenu(),  dispatch(updateCharacters({name: '', popularName: '', dob: '', age: '', height: '', weight: '', portrait: ''}))}}>
                        Add new character
                    </motion.button>)}

                {/* PROGRESSIONS /////////////////////////////////////////////////////////// */}
                <motion.button whileTap={{scale: 0.8}} className=" lg:hover:scale-[1.05]">
                    Progressions
                </motion.button>
                    {false && (<motion.button whileTap={{scale: 0.8}} className=" lg:hover:scale-[1.05]">
                        Add new progression
                    </motion.button>)}

                {/* LISTS /////////////////////////////////////////////////////////////////// */}
                <motion.button whileTap={{scale: 0.8}} className=" lg:hover:scale-[1.05]">
                    Lists
                </motion.button>
                    {false && (<motion.button whileTap={{scale: 0.8}} className="lg:hover:scale-[1.05]">
                        Add new list
                    </motion.button>)}
                
            </motion.aside>)}

            
            <motion.div 

            // THIS PREVENTS THE ASIDE BAR AND MENU ICON FROM BEING DRAGGED BEYOND SPECIFIED AREA
            onPan={(e, info)=>{
            if(info.point.x < 215 && info.point.x > 0){
                document.querySelector('.menuIcon').style.left = `${info.point.x}px`; 
                document.querySelector('.aside').style.left = `${info.point.x}px`; 
                document.querySelector('.menuIcon').style.transform = `translate(-50%, -50%) scale(${2-(info.point.x/200)})`
            }
            }}

            // ENSURES NO TRANSITION DURATION TO LAG THE MOVEMENT BEHIND
            onPanStart={(e, info)=>{document.querySelector('.menuIcon').style.transition = '0s';
                                    document.querySelector('.aside').style.transition = '0s'}}

            onPanEnd={(e, info)=>{
                // ADDS THE TRANSITION DURATION BACK, ENSURING SMOOTH SNAPPING TO EXPECTED POSITIONS
                document.querySelector('.menuIcon').style.transition = '0.3s'; 
                document.querySelector('.aside').style.transition = '0.3s';

                // LOGIC TO SNAP BACK TO EXPECTED POSITIONS
                if(info.point.x > 100){
                    document.querySelector('.menuIcon').style.transform = `translate(-50%, -50%) scale(${2-(180/200)})`
                    
                    // DIFFERENT SNAP POSITIONS FOR MOBILE AND PC
                    if(innerWidth<500){
                        document.querySelector('.menuIcon').style.left = `180px`; 
                        document.querySelector('.aside').style.left = `180px`; 
                    }else{
                        document.querySelector('.menuIcon').style.left = `215px`; 
                        document.querySelector('.aside').style.left = `215px`; 
                    }
                    
                }
                // SNAP BACK TO ORIGIN
                else{
                    document.querySelector('.menuIcon').style.left = `0px`; 
                    document.querySelector('.aside').style.left = `0px`; 
                    document.querySelector('.menuIcon').style.transform = `translate(-50%, -50%) scale(${2-(0/200)})` 
                }
            }}
            className="menuIcon duration-[0.3s] w-[40px] h-[40px] rounded-[50%] bg-[#eeeeeee5] fixed z-[45] top-[50vh] left-[0px] flex justify-center items-center"
            style={{transform: 'translate(-50%, -50%) scale(2)',  boxShadow: '0px 0px 20px 5px rgba(0,0,0,0.2)', touchAction: 'none'}}
            onClick={()=>{
                // SNAP TO EXPECTED POSITIONS WHEN CLICKED
                if(document.querySelector('.menuIcon').style.left < `10px`){

                    document.querySelector('.menuIcon').style.left = innerWidth<500?'180px':'215px';
                    document.querySelector('.menuIcon').style.transform = `translate(-50%, -50%) scale(${2-(180/200)})`
                    document.querySelector('.aside').style.left = innerWidth<500?'180px':'215px';
                }else{
                    document.querySelector('.menuIcon').style.left = `0px`;
                    document.querySelector('.menuIcon').style.transform = `translate(-50%, -50%) scale(${2-(0/200)})` 
                    document.querySelector('.aside').style.left = `0px`;
                }
            }}>
                <MenuRounded style={{fontSize: '20px', color: '#2c2c2c'}}/>
            </motion.div>

            {/* ZOOM SLIDER ////////////////////////////////////////////// */}
            {storyTimeline && (<input type="range" min={innerWidth<500? 15: 25} max={50} value={slider} step={1} onInput={(e)=>{dispatch(handleZoom(e.target.value))}}
            className="slider w-[85vw] lg:w-[90vw] absolute z-[51] bottom-[5%] left-[50%] translate-x-[-50%]"/>)}


            <div className="fixed w-[100vw] h-[2px] bg-white z-[50] bottom-0">
            
            </div>
            
            
        </motion.div>
     );
}
 
export default Commands;