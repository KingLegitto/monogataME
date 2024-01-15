import { ArrowDropDownRounded, KeyboardDoubleArrowLeftRounded, KeyboardDoubleArrowRightRounded, RemoveRounded } from '@mui/icons-material';
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomContext } from '../App.jsx'
import { useContext } from 'react'

const PlotElements = ({keyID, y, x, pointTitle, pointDetails, bgColor, type, deletePoint, updatePoint, kind}) => {
    const point = useRef(null)
    const textbox = useRef(null)
    const [dragctrl, setDrag] = useState(true)
    const [boundaryL, setBoundaryL] = useState(0)
    const [boundaryR, setBoundaryR] = useState(0)
    const [boundaryT, setBoundaryT] = useState(0)
    const [boundaryB, setBoundaryB] = useState(0)
    const [check, setCheck] = useState(true)
    const [clickCounter, setClickCounter] = useState(0)
    const [displacement, setDisplacement] = useState([0, 0])
    const [viewDetails, setViewDetails] = useState(false)
    const [gridEnforcementX, setGridEnforcementX] = useState(0)
    const [gridEnforcementY, setGridEnforcementY] = useState(0)
    const [sectionRange, setSectionRange] = useState(0)
    
    const {handleZoom, setSlider, slider, collapseShiftCorrect, setCollapseShiftCorrect} = useContext(ZoomContext)

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
        let limitB = document.querySelector('.bgImage').offsetHeight - (point.current.offsetHeight + point.current.offsetTop)

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
        let limitB = document.querySelector('.bgImage').offsetHeight - (point.current.offsetHeight + point.current.offsetTop)

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
        document.querySelector('.overallParent').style.paddingBottom = '100vh'

        setClickCounter(clickCounter+1)

        // AFTER THIS SPECIFIED TIME ELAPSES, IT WON'T BE A DOUBLE CLICK ANYMORE
        setTimeout(() => {
            setClickCounter(0)
        }, 500);

        // STATEMENTS TO BE EXECUTED AFTER SUCCESSFUL DOUBLE CLICK
        if(clickCounter == 1){

            // setViewDetails(true)
            
            // AUTO ZOOMING ON POINT (ONLY FOR MOBILE DEVICES)
            if(innerWidth < 500 && slider < 32){
                handleZoom(32)
                setSlider(32)
            }
           

            // WAIT FOR A LITTLE WHILE BEFORE AUTOMATICALLY FOCUS ON SELECTED POINT
            setTimeout(() => {
                document.querySelector('.overallParent').scrollTo((point.current.offsetLeft+displacement[0] - innerWidth/2 + (point.current.getBoundingClientRect().width/2)+25)*(slider<32&&innerWidth<500?32*2/100:slider*2/100), (point.current.offsetTop+displacement[1] - innerHeight/4)*(slider<32&&innerWidth<500?32*2/100:slider*2/100))
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
    useEffect(()=>{
        if(displacement[0] < boundaryL*-1){
            // alert('left')
            setDisplacement([boundaryL,displacement[1]])
        }
        if(displacement[0] > boundaryR){
            // alert('right')
            setDisplacement([boundaryR,displacement[1]])
        }
        if(displacement[1] < boundaryT*-1){
            // alert('top')
            setDisplacement([displacement[0],boundaryT])
        }
        if(displacement[1] > boundaryB){
            // alert('bottom')
            setDisplacement([displacement[0],boundaryB])
        }
    }, [displacement])

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
    
                    setGridEnforcementY(gridEnforcementY + 0.001)
                }
                else{
                    setGridEnforcementY(gridEnforcementY - 0.001)
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
            setGridEnforcementY(boundaryB)
        }
    }, [gridEnforcementX, gridEnforcementY])

    function sectionCollapse(){

            // THE SECTION POINT WHOSE COLLAPSE BUTTON WAS CLICKED IS THE CURRENT SECTION POINT
            let currentSectionTop = point.current.getBoundingClientRect().top

            let allSections = document.querySelectorAll('.sectionPoint')
            let targetSections = []

            // GET THE TOP POSITION OF ALL SECTION POINTS BELOW THE CURRENT SECTION POINT
            allSections.forEach((section)=>{
                if(section.getBoundingClientRect().top > currentSectionTop){
                    targetSections.push(section.getBoundingClientRect().top)
                }
            })
            
            // THE SMALLEST TOP POSITION VALUE IS INDEED THE IMMEDIATE NEXT SECTION BELOW CURRENT SECTION
            let nextSectionTop = Math.min(...targetSections)
            
            // THIS IS TO REMEMBER THE RANGE OF EFFECT THE CURRENT SECTION POINT HAS
            setSectionRange(!viewDetails? (nextSectionTop - currentSectionTop)*(100/(slider*2)) : sectionRange)
            console.log(`sectionRange: ${sectionRange}`)
            // LOGIC TO HIDE PLOT PLOINTS WITHIN RANGE AND TO MOVE ALL OTHER POINTS BELOW CURRENT SECTION POINT UPWARDS
            // TO FILL UP THE SPACE
            let allPoints = document.querySelectorAll('.point')
            allPoints.forEach((points)=>{
                // if(points.classList.contains('new')){
                //     console.log(sliderVal)
                // }
                // HIDE POINTS WITHIN SECTIONS RANGE OF EFFECT
                if(!viewDetails && points.getBoundingClientRect().top > currentSectionTop && points.getBoundingClientRect().top < nextSectionTop && points.style.visibility != 'hidden'){
                    
                    points.classList.add(`${keyID}`);
                    points.style.visibility = 'hidden';
                    
                }
                // ALL OTHER POINTS BELOW THAT ARE NOT WITHIN RANGE SHOULD MOVE UP 
                else if(!viewDetails && points.getBoundingClientRect().top > currentSectionTop){
                    points.classList.add('csc')
                    let range = nextSectionTop - currentSectionTop
                    points.style.transition = range*100/(slider*2)>=300?'0.5s':'0.2s'
                    let y = points.style.top
                    
                    y = (parseInt(y.replace(/px/,"")))
                    // console.log(`${y - (nextSectionTop - currentSectionTop)}px`)
                    points.style.top = `${(y - (range)*100/(slider*2) + (100))}px`
                    setTimeout(() => {
                        points.style.transition = '0s'
                    }, 500);
                }

                // WHEN COLLAPSE BUTTON IS PRESSED AGAIN, ALL POINTS BELOW SHOULD MOVE BACK DOWN
                if(viewDetails && points.getBoundingClientRect().top > currentSectionTop){
                    // EXCEPT THE POINTS WITHIN RANGE. THEY STAY IN THEIR POSITION
                    if(points.style.visibility == 'hidden' && points.classList.contains(`${keyID}`)){

                    }else{
                        points.style.transition = sectionRange>=300?'0.5s':'0.2s'
                        
                        let range = (nextSectionTop - currentSectionTop)*(100/(slider*2))
                        let y = points.style.top
                        y = (parseInt(y.replace(/px/,"")))
                        // console.log(`${y - (nextSectionTop - currentSectionTop)}px`)
                        points.style.top = `${(y + (sectionRange) - (100))}px`

                        // let csc = `${(y + (sectionRange) - (100))}px`
                        if(range > 100){
                            setCollapseShiftCorrect(((sectionRange - range)-100)*-1)
                            
                        }
                        // console.log(collapseShiftCorrect)
                        
                        // console.log(`range: ${range}`)
                        
                        setTimeout(() => {
                            points.style.transition = '0s'
                            // points.classList.remove('csc')
                        }, 500);
                    }   
                }
                // WHEN COLLAPSE BUTTON IS PRESSED AGAIN, POINTS WITHIN RANGE SHOULD GET VISIBLE
                if(viewDetails && points.classList.contains(`${keyID}`)){
                    points.style.visibility = 'visible'
                    points.classList.remove(`${keyID}`)

                }
            })
    }

    useEffect(()=>{
        if(point.current.classList.contains('csc')){
            console.log(collapseShiftCorrect)
            setGridEnforcementY(gridEnforcementY - collapseShiftCorrect)
            point.current.classList.remove('csc')
        }
        
    }, [collapseShiftCorrect])

    // useEffect(()=>{
    //     console.log('y')
    // }, [gridEnforcementY])

    function sectionChildren(distance){
        let allPoints = document.querySelectorAll('.point')
            allPoints.forEach((points)=>{
                if(points.classList.contains(`${keyID}`)){
                    let oldPos = points.style.top
                    oldPos = (parseInt(oldPos.replace(/px/,"")))
                    points.style.top = `${oldPos + distance}px`
                }
            })

    }


    return ( 
        <motion.div ref={point} initial={{opacity: 0}} animate={{opacity: 1, transition:{duration: 0.2, opacity:{duration: 0.2, delay: 0.3}}, x: type=='section'?'-50%': gridEnforcementX, y: gridEnforcementY}} drag={type=='section'?'y':true} dragListener={dragctrl?true:false} 
        whileDrag={{scale: 1.1}}  dragMomentum={false} onDragStart={()=>{setCheck(!check)}} onDragEnd={(e, info)=>{
            
            snapToGrid(info.offset.x, info.offset.y);
            type=='section'&&viewDetails?sectionChildren(info.offset.y):''
            // alert(`BL:${boundaryL}, BT:${boundaryT}, BR:${boundaryR}, BB:${boundaryB}, offsetx:${info.offset.x}`)
            setDisplacement([displacement[0] + info.offset.x, displacement[1] + info.offset.y])
           
            
        }}
        dragTransition={{ bounceStiffness: 1000, bounceDamping: 20 }}
        dragConstraints={{left: boundaryL*-1, right: boundaryR, top: boundaryT*-1, bottom: boundaryB}} 
        onTap={(event)=>{dblclickCheck()}}
      
        className={`${type=='section'?'sectionPoint': 'plotPoint'} point w-[auto] min-w-[100px] flex 
        flex-col items-center h-[auto] min-h-[100px] absolute rounded-[20px] py-[10px] px-[10px]`}

        style={{ top: y, left: x, backgroundColor: bgColor, color: bgColor=='#000000bb' || bgColor=='#ff3e5fe5'?'white':'black',
        width:type=='section'?viewDetails?'500px':'auto': !dragctrl?'200px':'auto', maxWidth: type=='section'?viewDetails?'500px':'300px':'200px',minHeight: type=='section'?'auto':'70px', zIndex: type=='section'?'35': !dragctrl || viewDetails? '40': '5',
        boxShadow: type=='plot'? !dragctrl?'0px 10px 33px -7px rgba(0,0,0,1)':'0px 10px 33px -7px rgba(0,0,0,0.75)': '0px 0px 10px -5px rgba(0,0,0,0.75)', paddingBottom: !dragctrl&&type=='plot'? '40px': type=='plot'&& !viewDetails? '0px': '15px',
        border: dragctrl? '1px solid transparent': bgColor=='#000000bb'? '1px solid white': '1px solid black', borderRadius: type=='plot'?'20px':viewDetails? '10px':'30px'}}>

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
 
export default PlotElements;