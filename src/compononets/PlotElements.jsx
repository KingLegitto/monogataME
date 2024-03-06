import { ArrowDropDownRounded, KeyboardDoubleArrowLeftRounded, KeyboardDoubleArrowRightRounded, RemoveRounded } from '@mui/icons-material';
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomContext } from '../App.tsx'
import { useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { handleZoom } from '../redux/reduxStates.js';

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
    const [viewDetails, setViewDetails] = useState(false)
    const [gridEnforcementX, setGridEnforcementX] = useState(0)
    const [gridEnforcementY, setGridEnforcementY] = useState(0)
    const [sectionRange, setSectionRange] = useState(0)
    const [currentTopPos, setCurrentTopPos] = useState()
    const [pcsc, setPcsc] = useState(false)
    
    const { workableArea, slider } = useSelector((state)=> state.overallStates)
    const dispatch = useDispatch()

    const {
        collapseShiftCorrect, setCollapseShiftCorrect,
        removeCsc, setRemoveCsc, setChildCarryTrigger, childCarryTrigger,
        currentCollapseInstigator, setCurrentCollapseInstigator
    } = useContext(ZoomContext)

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
        console.log(gridEnforcementY)
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
    }, [gridEnforcementX, gridEnforcementY])

    useEffect(()=>{
        if(!(point.current.classList.contains('csc'))){
            let plotPoints = document.querySelectorAll('.plotPoint')
            plotPoints.forEach((child)=>{
                if(child.classList.contains('csc')){
                    child.classList.remove('csc')
                }
            })
        }
        
    }, [gridEnforcementY])

    function sectionCollapse(){

            // THE SECTION POINT WHOSE COLLAPSE BUTTON WAS CLICKED IS THE CURRENT SECTION POINT
            let currentSectionTop = point.current.getBoundingClientRect().top
            let topPos = point.current.getBoundingClientRect().top
            setCurrentCollapseInstigator(topPos)

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
            if(nextSectionTop > workableArea.height){
                // alert('yh')
                // currentSectionHeight = (parseInt(currentSectionHeight.replace(/px/,"")))
                let lastSetOfPoints = []
                let Points = document.querySelectorAll('.plotPoint')
                Points.forEach((points)=>{
                    console.log('yep')
                    if(points.getBoundingClientRect().top > currentSectionTop){
                        lastSetOfPoints.push(((points.getBoundingClientRect().top) + 100*(slider*2)/100))
                    }
                })
                nextSectionTop = (Math.max(...lastSetOfPoints))
                console.log(Math.max(...lastSetOfPoints))
                
            }

            // if(!viewDetails){
            //     alert('yes')
            //     setCurrentCollapseInstigator(true)
            // }
            
            // THIS IS TO REMEMBER THE RANGE OF EFFECT THE CURRENT SECTION POINT HAS
            setSectionRange(!viewDetails? (nextSectionTop - currentSectionTop)*(100/(slider*2)) : sectionRange)
            console.log(nextSectionTop)
            console.log(`sectionRange: ${sectionRange}`)
            console.log(currentSectionTop)

            // LOGIC TO HIDE PLOT PLOINTS WITHIN RANGE AND TO MOVE ALL OTHER POINTS BELOW CURRENT SECTION POINT UPWARDS
            // TO FILL UP THE SPACE
            let allPoints = document.querySelectorAll('.point')
            allPoints.forEach((points)=>{
                
                if(viewDetails && points.getBoundingClientRect().top <= currentSectionTop){

                    if(points.classList.contains('csc')){
                        points.classList.remove('csc')
                        setRemoveCsc([keyID,true])
                    }
                }

                if(points.getBoundingClientRect().top < currentSectionTop - 10){
                    
                    points.classList.add('potentialCsc')
                    // console.log(`potentialCsc: ${points.getBoundingClientRect().top}`)

                }
                // if(points.classList.contains('sectionPoint') && points.getBoundingClientRect().top > currentSectionTop){
                //     points.classList.add('csc')
                //     // points.classList.remove('potentialCsc')
                // }
                // HIDE POINTS WITHIN SECTIONS RANGE OF EFFECT
                if(!viewDetails && points.getBoundingClientRect().top > currentSectionTop && points.getBoundingClientRect().top < nextSectionTop && points.style.visibility != 'hidden'){
                    
                    points.classList.add(`${keyID}`);
                    points.style.visibility = 'hidden';
                    
                }
                
                else if(viewDetails && points.classList.contains('potentialCsc')){
                    points.classList.add('csc')
                    // points.classList.remove('potentialCsc')
                }
                
                // ALL OTHER POINTS BELOW THAT ARE NOT WITHIN RANGE SHOULD MOVE UP 
                else if(!viewDetails && points.getBoundingClientRect().top > currentSectionTop){
                    points.classList.add('csc')
                    let range = nextSectionTop - currentSectionTop
                    points.style.transition = range*100/(slider*2)>=300?'0.5s':'0.2s'
                    let y = points.style.top
                    
                    // ONLY SECTION POINTS OR VISIBLE PLOT POINTS SHOULD MOVE UP
                    if(points.classList.contains('sectionPoint') || points.style.visibility != 'hidden'){
                        y = (parseInt(y.replace(/px/,"")))
                        // console.log(`${y - (nextSectionTop - currentSectionTop)}px`)
                        
                        points.style.top = `${(y - (range)*100/(slider*2) + (100))}px`

                        
                            setChildCarryTrigger(!childCarryTrigger)
                        
                        
                        // console.log(`triggerIsTrue`)
                    }
                    
                    setTimeout(() => {
                        points.style.transition = '0s'
                    }, 300);
                }

                // WHEN COLLAPSE BUTTON IS PRESSED AGAIN, ALL POINTS BELOW SHOULD MOVE BACK DOWN
                if(viewDetails && points.getBoundingClientRect().top > currentSectionTop){
                    // EXCEPT THE POINTS WITHIN RANGE. THEY STAY IN THEIR POSITION
                    if(points.style.visibility == 'hidden' && points.classList.contains(`${keyID}`)){
                        if(points.classList.contains('csc')){
                            points.classList.remove('csc')
                        }
                    }else{
                        
                        points.style.transition = sectionRange>=300?'0.5s':'0.2s'
                        
                        let range = (nextSectionTop - currentSectionTop)*(100/(slider*2))

                        // ONLY SECTION POINTS MOVE DOWN
                        if(points.classList.contains('sectionPoint') || points.style.visibility != 'hidden'){
                            let y = points.style.top
                            y = (parseInt(y.replace(/px/,"")))
                            // console.log(`${y - (nextSectionTop - currentSectionTop)}px`)
                            points.style.top = `${(y + (sectionRange) - (100))}px`

                            
                                setChildCarryTrigger(!childCarryTrigger)
                            
                            
                            // console.log(`triggerIsTrue`)
                            
                        }
                        

                        // let csc = `${(y + (sectionRange) - (100))}px`
                        // if(points.classList.contains('potentialCsc')){
                        //     console.log(`pcsc range: ${range}`)
                        // }
                        if(points.classList.contains('potentialCsc')){
                            
                            
                                setCollapseShiftCorrect([range - 100, true])
                            
                            
                            
                        }
                        else if(range > 100){
                            
                            setCollapseShiftCorrect([Math.abs((sectionRange - range)-100), true])
                            // console.log(`sectionRange: ${sectionRange}`)
                        }
                        // console.log(collapseShiftCorrect)
                        
                        
                        
                        setTimeout(() => {
                            points.style.transition = '0s'
                            // points.classList.remove('csc')
                        }, 300);
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
        if(point.current.classList.contains('sectionPoint') && point.current.getBoundingClientRect().top < currentCollapseInstigator){
            setPcsc(true)
            // alert('instigator')
        }
        console.log(`collapseInst: ${currentCollapseInstigator}`)
    },[currentCollapseInstigator])

    useEffect(()=>{
        
        if(point.current.classList.contains('csc') && point.current.getBoundingClientRect().top > currentCollapseInstigator && collapseShiftCorrect[1]){
            if(point.current.classList.contains('plotPoint') && point.current.classList.contains('potentialCsc')){
                
            }
            else if(point.current.style.visibility == 'hidden'){

            }
            else if(point.current.style.visibility != 'hidden'){
                let y = point.current.style.top
                    
                    y = (parseInt(y.replace(/px/,"")))
                    // console.log(`${y - (nextSectionTop - currentSectionTop)}px`)
                    
                    point.current.style.top = `${y - collapseShiftCorrect[0]}px`
                    // alert(collapseShiftCorrect)
                    // alert(`csc, topY and boundingY: ${collapseShiftCorrect}, ${y}, ${point.current.getBoundingClientRect().top}`)
            
            }
            point.current.classList.remove('csc')
            // point.current.classList.remove('potentialCsc')
            setPcsc(false)
            // alert('pcsc removed')
            setCollapseShiftCorrect([collapseShiftCorrect[0], false])
        }
        
    }, [collapseShiftCorrect[1]])

    // useEffect(()=>{
    //     console.log('y')
    // }, [gridEnforcementY])

    // THIS FUNCTION ENSURES CHILDREN POINTS ARE DRAGGED ALONG WITH SECTION WHEN USER DRAGS COLLAPSED SECTION
    function sectionChildren(distance){
        let y = Math.round((distance/100))*100
        // console.log(distance)
        // console.log(y)
        let allPoints = document.querySelectorAll('.point')
            allPoints.forEach((points)=>{
                if(points.classList.contains(`${keyID}`)){
                    let oldPos = points.style.top
                    oldPos = (parseInt(oldPos.replace(/px/,"")))
                    points.style.top = `${oldPos + y}px`
                }
            })

    }

    useEffect(()=>{
        if(removeCsc[1] && point.current.classList.contains(`${removeCsc[0]}`) && point.current.classList.contains('plotPoint')){
            point.current.classList.remove('csc')
        }
    }, [removeCsc])

    
    useEffect(()=>{
        let pos = point.current.style.top
        pos = (parseInt(pos.replace(/px/,"")))
        setCurrentTopPos(pos)

        // CARRY CHILDREN ALONG ANYTIME TOP POSITION CHANGES
        if(point.current.classList.contains('collapsed')){
            
            // console.log(`currentTop: ${currentTopPos}`)
            // console.log(`newTop: ${pos}`)

            // currentTopPos is actually the previous top position of section point
            if(currentTopPos > pos || currentTopPos < pos){
                console.log('SECTION CARRY!!!')
                let plotPoints = document.querySelectorAll('.plotPoint')
                plotPoints.forEach((plot)=>{
                
                if(plot.classList.contains(`${keyID}`)){
                    console.log('good')
                    let y = plot.style.top
                
                    y = (parseInt(y.replace(/px/,"")))
                            // console.log(`${y - (nextSectionTop - currentSectionTop)}px`)
                            
                    let move = pos - currentTopPos
                    plot.style.top = `${(y + move)}px`
                    console.log(currentTopPos)
                    
                    console.log(y+move)
                    // setChildCarryTrigger(false)
                }
            })
            
            }    
        }

        // RECALIBRATE TO TOP POSITION 0 IF TOP POSITIONS EXCEEDS -100
        // if(point.current.style.visibility != 'hidden'){
        //     let pointPos = point.current.style.top
        //     pointPos = (parseInt(pointPos.replace(/px/,"")))

            // point.current.style.top = `${Math.round(pointPos)}px`
            // if(pointPos <= -300){
            //     setTimeout(() => {
            //         point.current.style.top = `${(gridEnforcementY + pointPos)}px`
            //         setGridEnforcementY(0)

            //         if(point.current.classList.contains('sectionPoint')){
            //             setCurrentTopPos(0)
            //         }
                    

            //     }, 700);
                
            // }
        // }
        
        
            if( point.current.style.visibility != 'hidden' && pos + gridEnforcementY > workableArea.height -100){
                alert('Oops. It appears some points have escaped their boundaries')

                point.current.style.visibility = 'hidden'

                setTimeout(() => {
                    setGridEnforcementY(0)
                    point.current.style.top = `${workableArea.height-100}px`
                    setTimeout(() => {
                        point.current.style.visibility = 'visible'
                    }, 700);
                }, 500);   
            }
        
        


        
    }, [childCarryTrigger])

    useEffect(()=>{
        let y = point.current.style.top
        y = (parseInt(y.replace(/px/,"")))
        setCurrentTopPos(y)
    }, [])



    return ( 
        <motion.div ref={point} initial={{opacity: 0}} animate={{opacity: 1, transition:{duration: 0.2, opacity:{duration: 0.2, delay: 0.3}}, x: type=='section'?'-50%': gridEnforcementX, y: gridEnforcementY}} drag={type=='section'?'y':true} dragListener={dragctrl?true:false} 
        whileDrag={{scale: 1.1}}  dragMomentum={false} onDragStart={()=>{setCheck(!check)}} onDragEnd={(e, info)=>{
            
            snapToGrid(info.offset.x, info.offset.y);
            type=='section'&&viewDetails?sectionChildren(info.offset.y):''
            // alert(`BL:${boundaryL}, BT:${boundaryT}, BR:${boundaryR}, BB:${boundaryB}, offsetx:${info.offset.x}`)           
            
        }}
        dragTransition={{ bounceStiffness: 1000, bounceDamping: 20 }}
        dragConstraints={{left: boundaryL*-1, right: boundaryR, top: boundaryT*-1, bottom: boundaryB}} 
        onTap={(event)=>{dblclickCheck()}}
      
        className={`${type=='section'?'sectionPoint': 'plotPoint'}  ${viewDetails? type=='section'? 'collapsed': '' :'' } ${pcsc? type=='section'?'potentialCsc':'':''} point w-[auto] min-w-[100px] flex 
        flex-col items-center h-[auto] min-h-[100px] absolute rounded-[20px] py-[10px] px-[10px]`}

        style={{ top: y, left: x, backgroundColor: bgColor, color: bgColor=='#000000bb' || bgColor=='#ff3e5fe5'?'white':'black',
        width:type=='section'?viewDetails?'500px':'auto': !dragctrl?'200px':'auto', maxWidth: type=='section'?viewDetails?'500px':'300px':'200px',minHeight: type=='section'?'auto':'70px', zIndex: type=='section'?'35': !dragctrl || viewDetails? '40': '5',
        boxShadow: type=='plot'? !dragctrl?'0px 10px 33px -7px rgba(0,0,0,1)':'0px 10px 33px -7px rgba(0,0,0,0.75)': '0px 0px 10px -5px rgba(0,0,0,0.75)', paddingBottom: !dragctrl&&type=='plot'? '40px': type=='plot'&& !viewDetails? '0px': '15px',
        border: dragctrl? '1px solid transparent': bgColor=='#000000bb'? '1px solid white': '1px solid black', borderRadius: type=='plot'?'20px':viewDetails? '20px':'30px'}}>

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