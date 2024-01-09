import { ArrowDropDownRounded, KeyboardDoubleArrowLeftRounded, KeyboardDoubleArrowRightRounded, RemoveRounded } from '@mui/icons-material';
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomContext } from '../App.jsx'
import { useContext } from 'react'

const PlotElements = ({keyID, y, x, pointTitle, pointDetails, bgColor, type, deletePoint, updatePoint, plotDragConstraints,
    referenceL, referenceR, referenceT, referenceB}) => {
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
    
    const {handleZoom, setSlider, slider} = useContext(ZoomContext)

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
            if(innerWidth < 500 && slider < 40){
                handleZoom(40)
                setSlider(40)
            }
           

            // WAIT FOR A LITTLE WHILE BEFORE AUTOMATICALLY FOCUS ON SELECTED POINT
            setTimeout(() => {
                document.querySelector('.overallParent').scrollTo(point.current.offsetLeft+displacement[0] - (point.current.offsetLeft*(slider>40?(100-slider*2)/100:0.2)) - innerWidth/4, point.current.offsetTop+displacement[1] - (point.current.offsetTop*(slider>=40?(100-slider*2)/100:0.2))- innerHeight/5)
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


    return ( 
        <motion.div ref={point} drag={type=='section'?'y':true} dragListener={dragctrl?true:false} 
        whileDrag={{scale: 1.1}} dragMomentum={false} onDragStart={()=>{setCheck(!check)}} onDragEnd={(e, info)=>{
            // alert(`BL:${boundaryL}, BT:${boundaryT}, BR:${boundaryR}, BB:${boundaryB}, offsetx:${info.offset.x}`)
            setDisplacement([displacement[0] + info.offset.x, displacement[1] + info.offset.y])
           
            
        }} dragTransition={{ bounceStiffness: 600, bounceDamping: 50 }}
        dragConstraints={{left: boundaryL*-1, right: boundaryR, top: boundaryT*-1, bottom: boundaryB}} 
        onTap={(event)=>{dblclickCheck()}}
      
        className={`${type=='section'?'sectionPoint': 'plotPoint'} point w-[auto] min-w-[100px] max-w-[200px] flex 
        flex-col items-center h-[auto] min-h-[100px] absolute rounded-[20px] py-[10px] px-[10px]`}

        style={{top: y, left: x, backgroundColor: bgColor, color: bgColor=='#000000bb' || bgColor=='#ff3e5fe5'?'white':'black',
        width:type=='section'?'200px': !dragctrl?'200px':'auto', minHeight: type=='section'?'auto':'70px', zIndex: type=='section'?'35': !dragctrl? '40': '5',
        boxShadow: type=='plot'? !dragctrl?'0px 10px 33px -7px rgba(0,0,0,1)':'0px 10px 33px -7px rgba(0,0,0,0.75)': '0px 0px 10px -5px rgba(0,0,0,0.75)', paddingBottom: !dragctrl&&type=='plot'? '40px': type=='plot'&& !viewDetails? '0px': '20px',
        border: dragctrl? '1px solid transparent': bgColor=='#000000bb'? '1px solid white': '1px solid black'}}>

            {/* BADGE  ///////////////////////////////////////////////////////////// */}
            {type=='plot' && (<div className='w-[20px] h-[20px] bg-black absolute top-0 left-0
             translate-x-[-35%] translate-y-[-40%] text-white flex justify-center items-center'
             style={{left: type=='section'?'50%':0, cursor: 'pointer', borderRadius: dragctrl? '50%': '25%'}}>
                    {type=='plot' && (<span></span>)}
            </div>)}

            {/* POINT TITLE  //////////////////////////////////////////////////////////// */}
            <div ref={textbox} contentEditable suppressContentEditableWarning={true} spellCheck={false}
            className={`w-[auto] ${viewDetails?'Lora':''} max-w-[100%] rounded-[10px] focus:outline-none selection:bg-[#fd79ee]`}
            style={{textAlign: 'center', pointerEvents: dragctrl?'none':'all', fontWeight: viewDetails? 'bold': 'normal'}}>
                {pointTitle}
            </div>

            {/* POINT DETAILS //////////////////////////////////////////////////////// */}
            
            {type=='plot' && (<motion.div initial={{height: 0, opacity: 0}} animate={{height: viewDetails? 'auto': '0px', opacity: viewDetails? 1: 0}} contentEditable suppressContentEditableWarning={true} spellCheck={false}
            className='w-[auto] max-w-[100%] overflow-hidden opacity-0 h-0 px-[8px] text-center rounded-[20px] py-[10px] bg-[#ffffff32] focus:outline-none hyphens-auto selection:bg-[#fd79ee]'
            style={{pointerEvents: dragctrl?'none':'all' }}>
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
            <span className='absolute top-[100%] translate-y-[-52%]  w-[20%] rounded-[20px] flex justify-center border-[1px] border-[#ffffffa9]'
            style={{background:type=='section'? '#2c2c2c': bgColor=='#000000bb'? '#000000':bgColor=='#1bffbbe5'?'#1bffbb':bgColor=='#ff3e5fe5'? '#ff3e5f':bgColor=='#ffe42be5'? '#ffe42b': '#eeeeee', boxShadow: '0px 0px 5px 5px rgba(0,0,0,0.11)'}}
            onClick={()=>{setViewDetails(!viewDetails)}}>
                <ArrowDropDownRounded style={{transform: 'scale(1.5)'}}/>
            </span>
            


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