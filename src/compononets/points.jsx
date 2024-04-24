import { ArrowDropDownRounded, KeyboardDoubleArrowLeftRounded, KeyboardDoubleArrowRightRounded, RemoveRounded } from '@mui/icons-material';
import { motion } from 'framer-motion'
import { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomContext } from '../App.tsx'
import { useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { handleZoom, removeFromHiddenPoints, updateHiddenPoints, updateTracker } from '../redux/reduxStates.js';

const Points = ({keyID, y, x, pointTitle, pointDetails, bgColor, type, deletePoint, updatePoint, points}) => {
    const point = useRef(null)
    const textbox = useRef(null)
    const [dragctrl, setDrag] = useState(true)
    const [boundaryL, setBoundaryL] = useState(0)
    const [boundaryR, setBoundaryR] = useState(0)
    const [boundaryT, setBoundaryT] = useState(0)
    const [boundaryB, setBoundaryB] = useState(0)
    const [check, setCheck] = useState(true)
    const [clickCounter, setClickCounter] = useState(0)
    const [viewDetails, setViewDetails] = useState(false)
    const [gridEnforcementX, setGridEnforcementX] = useState(0)
    const [gridEnforcementY, setGridEnforcementY] = useState(0)
    const [isHidden, setIsHidden] = useState(false)
    
    const { workableArea, slider, sectionTracker, plotTracker, hiddenPoints, hideTrigger } = useSelector((state)=> state.overallStates)
    const dispatch = useDispatch()

    const colorsCont = {
        hidden: {opacity: 0},
        visible: {opacity: 1, transition:{ duration: 0.01 ,staggerChildren: 0.05}},
        leave: {opacity: 0, scale: 1.2, transition:{duration: 0.1}}

    }

    const colorsAnimate = {
        hidden: {opacity: 0, y: 10},
        visible: {opacity: 1, y: 0, transition:{duration: 0.07}},
    }

    useEffect(()=>{
        let limitL = point.current.offsetLeft
        let limitR = document.querySelector('.bgImage').offsetWidth - (point.current.offsetWidth + point.current.offsetLeft)
        let limitT = point.current.offsetTop
        let limitB = document.querySelector('.bgImage').offsetHeight - (point.current.offsetTop + 100)

        setBoundaryL(limitL)
        setBoundaryR(limitR)
        setBoundaryT(limitT)
        setBoundaryB(limitB)

    }, [check])

    useEffect(()=>{
        setTimeout(() => {
            let limitL = point.current.offsetLeft
        let limitR = document.querySelector('.bgImage').offsetWidth - (point.current.offsetWidth + point.current.offsetLeft)
        let limitT = point.current.offsetTop
        let limitB = document.querySelector('.bgImage').offsetHeight - (point.current.offsetTop + 100)

        setBoundaryL(limitL)
        setBoundaryR(limitR)
        setBoundaryT(limitT)
        setBoundaryB(limitB)
        }, 1000);
        

    }, [viewDetails])
    

    // FUNCTION TO CATCH WHEN THE USER DOUBLE CLICKS ON A POINT
    const dblclickCheck = ()=>{
        // alert(`offset:${point.current.offsetTop}, bounding:${point.current.getBoundingClientRect().top}`)
        // THIS ADDS PADDING AT THE BOTTOM TO GIVE ROOM FOR AUTO FOCUS SCROLL
      

        setClickCounter(clickCounter+1)

        // AFTER THIS SPECIFIED TIME ELAPSES, IT WON'T BE A DOUBLE CLICK ANYMORE
        setTimeout(() => {
            setClickCounter(0)
        }, 500);

        // STATEMENTS TO BE EXECUTED AFTER SUCCESSFUL DOUBLE CLICK
        if(clickCounter == 1){
            document.querySelector('.overallParent').style.paddingBottom = '100vh'
            // setViewDetails(true)
            
            // AUTO ZOOMING ON POINT (ONLY FOR MOBILE DEVICES)
            if(innerWidth < 500 && slider < 32){
                dispatch(handleZoom(32))
            }
           

            // WAIT FOR A LITTLE WHILE BEFORE AUTOMATICALLY FOCUS ON SELECTED POINT
            setTimeout(() => {
                type=='section'?document.querySelector('.overallParent').scrollTo((point.current.offsetLeft+gridEnforcementX - innerWidth/2 + (point.current.getBoundingClientRect().width/2)+25-(point.current.getBoundingClientRect().width/1.5))*(slider<32&&innerWidth<500?32*2/100:slider*2/100), (point.current.offsetTop+gridEnforcementY - innerHeight/4)*(slider<32&&innerWidth<500?32*2/100:slider*2/100)):
                document.querySelector('.overallParent').scrollTo((point.current.offsetLeft+gridEnforcementX - innerWidth/2 + (point.current.getBoundingClientRect().width/2)+25)*(slider<32&&innerWidth<500?32*2/100:slider*2/100), (point.current.offsetTop+gridEnforcementY - innerHeight/4)*(slider<32&&innerWidth<500?32*2/100:slider*2/100))
                // document.querySelector('.overallParent').scrollTo(point.current.getBoundingClientRect().left, point.current.getBoundingClientRect().top)
                  
            }, 300);
            
            // RESET CLICK COUNTER JUST IN CASE AND ACTIVATE EDIT MODE ON POINT
            setClickCounter(0)
            setCheck(!check); 
            setDrag(false); updatePoint(); window.getSelection()?.removeAllRanges()
        }
        
    }

    useEffect(()=>{
        // ADDS EVENT LISTENER IF EDIT MODE ON A POINT IS ACTIVATED
        if(!dragctrl){
            window.addEventListener('click', closeEditMode)
        }else{
                // RESET BOTTOM PADDING TO 0
                document.querySelector('.overallParent').style.paddingBottom = '50px'

                
            }
    }, [dragctrl])

    // FUNCTION TO CATCH IF EDIT MODE IS ACTIVE ON A POINT AND USER CLICKS OUTSIDE SAID POINT
    const closeEditMode = useCallback((e)=>{
        let left = point.current.getBoundingClientRect().left
        let right = point.current.getBoundingClientRect().right
        let top = point.current.getBoundingClientRect().top
        let bottom = point.current.getBoundingClientRect().bottom
        
        // DEACTIVATES EDIT MODE FOR POINT IF USER CLICKS AWAY
        if(!((e.pageX >= left && e.pageX <= right) && (e.pageY >= top && e.pageY <= bottom))){
            setDrag(true)
            // setViewDetails(false)
            window.removeEventListener('click', closeEditMode)
        
        }
        
        
    }, [])

    // TO PREVENT THE 'AUTO SCROLL TO POINTS' FROM OVERSHOOTING PAST THE BOUNDARIES
    
    function snapToGrid(distanceX, distanceY){
        
        // GRID SOLUTION FOR X
        if(Math.abs(distanceX) < 100 && type == 'plot'){

            if(Math.abs(distanceX) < 50){
                if(distanceX < 0){
    
                    setGridEnforcementX(gridEnforcementX + 0.001)
                }
                else{
                    setGridEnforcementX(gridEnforcementX - 0.001)
                }
            }
            if(Math.abs(distanceX) >= 50){
                if(distanceX < 0){
                    setGridEnforcementX(gridEnforcementX - 100)
                }else{
                    setGridEnforcementX(gridEnforcementX + 100)
                }
            }

        }
        if(Math.abs(distanceX) >= 100 && type == 'plot'){
            let n = Math.floor(distanceX/100)
            let c = n*100
            // console.log(`x: ${distanceX}, c: ${c}, n: ${n}`)
            if(Math.abs(distanceX%100) == 0){
                setGridEnforcementX(gridEnforcementX + c)
            }
            else if(Math.abs(distanceX%100)<50){
                setGridEnforcementX(gridEnforcementX + c + (c<0?100:0))
            }else{
                setGridEnforcementX(gridEnforcementX + c + (c<0?0:100))
            }
            
            
        }
        
        // GRID SOLUTION FOR Y
        if(Math.abs(distanceY) < 100){

            if(Math.abs(distanceY) < 50){
                if(distanceY < 0){
    
                    setGridEnforcementY(gridEnforcementY + 0.0001)
                }
                else{
                    setGridEnforcementY(gridEnforcementY - 0.0001)
                }
            }
            if(Math.abs(distanceY) >= 50){
                if(distanceY < 0){
                    setGridEnforcementY(gridEnforcementY - 100)
                }else{
                    setGridEnforcementY(gridEnforcementY + 100)
                }
            }

        }
        if(Math.abs(distanceY) >= 100){
            let n = Math.floor(distanceY/100)
            let c = n*100
            if(Math.abs(distanceY%100) == 0){
                setGridEnforcementY(gridEnforcementY + c)
            }
            else if(Math.abs(distanceY%100)<50){
                setGridEnforcementY(gridEnforcementY + c + (c<0?100:0))
            }else{
                setGridEnforcementY(gridEnforcementY + c + (c<0?0:100))
            }
        }
        
    }

    // TO PREVENT THE GRID FROM SNAPPING TO POINTS BEYOND THE BOUNDARIES
    useEffect(()=>{
        
        if(gridEnforcementX < boundaryL*-1){
            // console.log('leftBound')
            setGridEnforcementX(-boundaryL)
        }
        if(gridEnforcementX > boundaryR){
            // console.log('RightBound')
            setGridEnforcementX(boundaryR)
        }
        if(gridEnforcementY < boundaryT*-1){
            // console.log('TopBound')
            setGridEnforcementY(-boundaryT)
        }
        if(gridEnforcementY > boundaryB){
            // console.log('BottomBound')

            // TO ENSURE THE CHILDREN STAY WITH THE COLLAPSED SECTION POINT
            sectionChildren(boundaryB - gridEnforcementY)

            
            setGridEnforcementY(boundaryB)
            
        }

        type=='section'?
        dispatch(updateTracker({type: 'section', keyID: keyID, newYPos: Math.round(y + gridEnforcementY)})):
        dispatch(updateTracker({type: 'plot', keyID: keyID, newYPos: Math.round(y + gridEnforcementY)}))
        
    }, [gridEnforcementX, gridEnforcementY])

    function sectionCollapse(){
      let currentX = Math.round(x + gridEnforcementX)
      let currentY = Math.round(y + gridEnforcementY)
      let upperLimit = currentY
        
        // CLICKING TO COLLAPSE
        if(!viewDetails){
        let targetSections = []

        sectionTracker.forEach((item)=>{
            if(item.yPos > currentY){
                targetSections.push(item.yPos)
            }

        })
        let lowerLimit = Math.min(...targetSections)
        if(lowerLimit == Infinity){
            lowerLimit = workableArea.height
        }

        // MOVE POINTS BELOW UP TO FILL GAP
        sectionTracker.forEach((item)=>{
            if(item.yPos > currentY){
                updatePoint(item.id, undefined, undefined, undefined, upperLimit - lowerLimit + 100)
                dispatch(updateTracker({type: 'section', keyID: item.id, newYPos: item.yPos + upperLimit - lowerLimit + 100}))
            }

        })
      
        var wait = new Promise((resolve, reject)=>{
            let targets = []
            plotTracker.forEach((item, i, arr)=>{
                if(item.yPos > lowerLimit && !item.isChild){
                    updatePoint(item.id, undefined, undefined, undefined, upperLimit - lowerLimit + 100)
                    dispatch(updateTracker({type: 'plot', keyID: item.id, newYPos: item.yPos + upperLimit - lowerLimit + 100}))
                }
                if(item.yPos > upperLimit && item.yPos < lowerLimit && !item.isChild){
                    targets.push(item.id)
                    dispatch(updateTracker({type: 'plot', keyID: item.id, childState: true}))
                }
                if(i === arr.length -1){
                    dispatch(updateHiddenPoints(targets))
                    updatePoint(keyID,undefined,targets, currentY)
                  //   console.log(plotTracker)
                    resolve()
                }
            })
        })

        }

        // CLICKING TO EXPAND (UNCOLLAPSE)
      if(viewDetails){
        let targetPoints = []
        let belowTargetsArea = []
        let targetChildren = []
        
        // UNHIDE LOGIC
         points.forEach((point)=>{
            
            if(keyID == point._id){
               point.children.forEach((child)=>{
                  let childrenNewPos = updatePoint(child, undefined, undefined, undefined, currentY - point.childCarryStart)
                  dispatch(removeFromHiddenPoints(child))
                  dispatch(updateTracker({type: 'plot', keyID: child, childState: false}))
                //   alert(childrenNewPos)
                  plotTracker.forEach((item)=>{
                    if(child == item.id)targetChildren.push(childrenNewPos)
                  })
               })
            }
         })

         let furthestChildBottom = Math.max(...targetChildren) + 100
        //  alert(`FCB: ${furthestChildBottom}, FC: ${Math.max(...targetChildren)}`)

         sectionTracker.forEach((item)=>{
            if(item.yPos > currentY && item.yPos < furthestChildBottom){
                targetPoints.push(item.yPos)
            }
            else if(item.yPos > furthestChildBottom){
                belowTargetsArea.push(item.yPos)
            }

        })

        plotTracker.forEach((item)=>{
            if(item.yPos > currentY && item.yPos < furthestChildBottom && !item.isChild){
                targetPoints.push(item.yPos)
            }
            else if(item.yPos > furthestChildBottom && !item.isChild){
                belowTargetsArea.push(item.yPos)
            }
        })

        let closestPointInRange = Math.min(...targetPoints)
        closestPointInRange = closestPointInRange==Infinity?null:closestPointInRange

        let firstPointBelowArea = Math.min(...belowTargetsArea)

         sectionTracker.forEach((item)=>{
            if(item.yPos > currentY){
                updatePoint(item.id, undefined, undefined, undefined, closestPointInRange? furthestChildBottom - closestPointInRange:furthestChildBottom - firstPointBelowArea)
                // dispatch(updateTracker({type: 'section', keyID: item.id, newYPos: closestPointInRange? item.yPos + furthestChildBottom - closestPointInRange : item.yPos + furthestChildBottom - item.yPos}))
            }
        })

        plotTracker.forEach((item)=>{
            if(item.yPos > currentY && !item.isChild){
                updatePoint(item.id, undefined, undefined, undefined, closestPointInRange? furthestChildBottom - closestPointInRange:furthestChildBottom - firstPointBelowArea)
                // dispatch(updateTracker({type: 'plot', keyID: item.id, newYPos: closestPointInRange? item.yPos + furthestChildBottom - closestPointInRange : item.yPos + furthestChildBottom - item.yPos}))
            }
        })
      }
   }

    useEffect(()=>{
        
        let test = hiddenPoints.find((id)=>(keyID==id))

        if(test){
            setIsHidden(true)
        }else{
            setIsHidden(false)
        }

    }, [hideTrigger, hiddenPoints])


    return ( 
        <motion.div ref={point} initial={{opacity: 0}} animate={{opacity: 1, transition:{duration: 0.2, opacity:{duration: 0.2, delay: 0.3}}, x: type=='section'?'-50%': gridEnforcementX, y: gridEnforcementY}} drag={type=='section'?'y':true} dragListener={dragctrl?true:false} 
        whileDrag={{scale: 1.1}}  dragMomentum={false} onDragStart={()=>{setCheck(!check)}} onDragEnd={(e, info)=>{
            snapToGrid(info.offset.x, info.offset.y);
            if(type=='section'){

            }            
        }}
        dragTransition={{ bounceStiffness: 1000, bounceDamping: 20 }}
        dragConstraints={{left: boundaryL*-1, right: boundaryR, top: boundaryT*-1, bottom: boundaryB}} 
        onTap={(event)=>{dblclickCheck()}}
      
        className={`${type=='section'?'sectionPoint': 'plotPoint'}  ${viewDetails? type=='section'? 'collapsed': '' :'' } point w-[auto] min-w-[100px] flex 
        flex-col items-center h-[auto] min-h-[100px] absolute rounded-[20px] py-[10px] px-[10px] duration-[0.7s]`}

        style={{ top: y, left: x, display: isHidden? 'none': 'flex', backgroundColor: bgColor, color: bgColor=='#000000bb' || bgColor=='#ff3e5fe5'?'white':'black',
        width:type=='section'?viewDetails?'500px':'auto': !dragctrl?'200px':'auto', maxWidth: type=='section'?viewDetails?'500px':'300px':'200px',minHeight: type=='section'?'auto':'70px', zIndex: type=='section'?'35': !dragctrl || viewDetails? '40': '5',
        boxShadow: type=='plot'? !dragctrl?'0px 10px 33px -7px rgba(0,0,0,1)':'0px 10px 33px -7px rgba(0,0,0,0.75)': '0px 0px 10px -5px rgba(0,0,0,0.75)', paddingBottom: !dragctrl&&type=='plot'? '40px': type=='plot'&& !viewDetails? '0px': '15px',
        border: dragctrl? '1px solid transparent': bgColor=='#000000bb'? '1px solid white': '1px solid black', borderRadius: type=='plot'?'20px':viewDetails? '20px':'30px',
        transitionProperty: 'top'}}>

            {/* BADGE  ///////////////////////////////////////////////////////////// */}
            {type=='plot' && (<div className='w-[20px] h-[20px] bg-black absolute top-0 left-0
             translate-x-[-35%] translate-y-[-40%] text-white flex justify-center items-center'
             style={{left: type=='section'?'50%':0, cursor: 'pointer', borderRadius: dragctrl? '50%': '25%'}}>
                    {type=='plot' && (<span></span>)}
            </div>)}

            {/* POINT TITLE  //////////////////////////////////////////////////////////// */}
            <div ref={textbox} contentEditable suppressContentEditableWarning={true} spellCheck={false}
            className={`w-[auto] ${viewDetails? type=='plot'? 'Rubik':'':''} ${type=='section'? 'px-[10px]': ''} max-w-[100%] rounded-[10px] focus:outline-none selection:bg-[#fd79ee]`}
            style={{textAlign: 'center', pointerEvents: dragctrl?'none':'all', fontWeight: viewDetails? type=='plot'? 'bold': 'normal': 'normal'}}>
                {pointTitle}
            </div>

            {/* POINT DETAILS //////////////////////////////////////////////////////// */}
            
            {type=='plot' && (<motion.div animate={{y: viewDetails?0:-30}} contentEditable suppressContentEditableWarning={true} spellCheck={false}
            className='w-[100%] overflow-hidden h-0 px-[8px] text-center rounded-[20px] py-[10px] focus:outline-none hyphens-auto selection:bg-[#fd79ee]'
            style={{pointerEvents: dragctrl?'none':'all' , height: viewDetails? 'auto': '0px', opacity: viewDetails? 1:0, 
            background: bgColor=='#eeeeeee5'||bgColor=='#1bffbbe5'?'#00000032': bgColor=='#ffe42be5'?'#ffffff82':'#ffffff32',
            letterSpacing: '-0.5px'}}>
                {pointDetails}
            </motion.div>)}

            {/* SECTION POINT SIDES  //////////////////////////////////////////////// */}
            {/* LEFT */}
            { type=='section' && (<span className='mr-[50px] absolute right-[100%] top-[50%] translate-y-[-50%] flex items-center'>
                <KeyboardDoubleArrowLeftRounded style={{transform: 'scale(2)', color: '#000000bb', opacity: 0.5}}/>
            </span>)}
            {/* RIGHT */}
            { type=='section' && (<span className='ml-[50px] absolute left-[100%] top-[50%] translate-y-[-50%] flex items-center'>
                <KeyboardDoubleArrowRightRounded style={{transform: 'scale(2)', color: '#000000bb', opacity: 0.5}}/>
            </span>)}


            {/* COLLAPSE BUTTON */}
            <motion.span initial={{y: '-52%'}} animate={{y:'-52%'}} whileTap={{scale: 1.2}} className='absolute top-[100%] w-[50px] rounded-[20px] flex justify-center border-[1px] border-[#ffffffa9]'
            style={{background:type=='section'? '#2c2c2c': bgColor=='#000000bb'? '#000000':bgColor=='#1bffbbe5'?'#1bffbb':bgColor=='#ff3e5fe5'? '#ff3e5f':bgColor=='#ffe42be5'? '#ffe42b': '#eeeeee', boxShadow: '0px 0px 5px 5px rgba(0,0,0,0.11)'}}
            onClick={()=>{setViewDetails(!viewDetails), type=='section'? sectionCollapse(): ''}}>
                <ArrowDropDownRounded style={{transform: 'scale(1.5)', rotate: viewDetails? '180deg': '0deg'}}/>
            </motion.span>
            


            {/* DELETE BUTTON  ///////////////////////////////////////////////////////////// */}
            {!dragctrl && (<div onClick={()=>{deletePoint(keyID); }}
            className='w-[22px] h-[22px] rounded-[50%] absolute top-0 left-[100%] hover:scale-[1.2] duration-[0.1s]
             translate-x-[-60%] translate-y-[-40%] text-white flex justify-center items-center'
             style={{cursor: 'pointer', background: bgColor!='#ff3e5fe5'? '#ff3e5f': '#892132'}}>
                    <RemoveRounded style={{color: 'white'}} />
            </div>)}

            {/* COLOUR CHANGE  /////////////////////////////////////////////////////// */}
            
            {!dragctrl && type=='plot' && (
            
                <motion.div variants={colorsCont} initial={'hidden'} animate={'visible'} className='colorCont w-[150px] h-[20px] absolute bottom-[15px] flex justify-evenly mt-[10px]'>
                    <motion.span variants={colorsAnimate} whileHover={{scale: 1.2}} className='bg-[#1bffbb]' onClick={()=>{updatePoint(keyID, '#1bffbbe5'); }}>

                    </motion.span>
                    <motion.span variants={colorsAnimate} whileHover={{scale: 1.2}} className=' bg-[#ff3e5f]' onClick={()=>{updatePoint(keyID, '#ff3e5fe5'); }}>
                        
                    </motion.span>
                    <motion.span variants={colorsAnimate} whileHover={{scale: 1.2}} className='bg-[#ffe42b]' onClick={()=>{updatePoint(keyID, '#ffe42be5'); }}>
                        
                    </motion.span>
                    <motion.span variants={colorsAnimate} whileHover={{scale: 1.2}} className='bg-[#000000]' onClick={()=>{updatePoint(keyID, '#000000bb'); }}>
                        
                    </motion.span>
                    <motion.span variants={colorsAnimate} whileHover={{scale: 1.2}} className='bg-[#eeeeee]' onClick={()=>{updatePoint(keyID, '#eeeeeee5'); }}>
                        
                    </motion.span>
                </motion.div>
            )}
            

        </motion.div>
     );
}
 
export default Points;