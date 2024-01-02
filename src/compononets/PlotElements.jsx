import { RemoveRounded } from '@mui/icons-material';
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react';

const PlotElements = ({keyID,y,x,details,bgColor, type, deletePoint, updatePoint,
    referenceL, referenceR, referenceT, referenceB}) => {
    const point = useRef(null)
    const textbox = useRef(null)
    const [dragctrl, setDrag] = useState(true)
    const [boundaryL, setBoundaryL] = useState(1)
    const [boundaryR, setBoundaryR] = useState(1)
    const [boundaryT, setBoundaryT] = useState(1)
    const [boundaryB, setBoundaryB] = useState(1)
    const [check, setCheck] = useState(true)

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

    return ( 
        <motion.div ref={point} drag={type=='section'?'y':true} dragListener={dragctrl?true:false} 
        whileDrag={{scale: 1.1}} dragMomentum={false} 
        dragConstraints={{left: boundaryL*-1, right: boundaryR, top: boundaryT*-1, bottom: boundaryB}} 
        onContextMenu={(event)=>{event.preventDefault(); setCheck(!check)
            setDrag(!dragctrl); updatePoint(); window.getSelection()?.removeAllRanges()}}
      
        className='point w-[auto] min-w-[100px] max-w-[200px] flex flex-wrap flex-col justify-between
        h-[auto] min-h-[100px] absolute rounded-[10px] p-[10px]'

        style={{top: y, left: x, backgroundColor: bgColor, color: bgColor=='#000000bb' || bgColor=='#ff3e5fe5'?'white':'black',
        width:type=='section'?'200px':'auto', minHeight: type=='section'?'auto':'100px', zIndex: type=='section'?'5':'35',
        boxShadow: type=='plot'?'0px 10px 33px -7px rgba(0,0,0,0.75)': '0', paddingBottom: type=='plot'? '30px':'10px',
        border: dragctrl? '1px solid transparent': bgColor=='#000000bb'? '1px solid white': '1px solid black'}}>

            {/* BADGE  ///////////////////////////////////////////////////////////// */}
            <div className='w-[20px] h-[20px] bg-black absolute top-0 left-0
             translate-x-[-40%] translate-y-[-40%] text-white flex justify-center items-center'
             style={{left: type=='section'?'50%':0, cursor: 'pointer', borderRadius: dragctrl? '50%': '25%'}}>
                    {type=='plot' && (<span></span>)}
            </div>

            {/* TEXTBOX  //////////////////////////////////////////////////////////// */}
            <div ref={textbox} contentEditable suppressContentEditableWarning={true} spellCheck={false}
            className='w-[auto] max-w-[100%] rounded-[10px] focus:outline-none hyphens-auto selection:bg-[#fd79ee]'
            style={{textAlign: type=='plot'?'left':'center', pointerEvents: dragctrl?'none':'all'}}>
                {details}
            </div>

            {/* SECTION POINT SIDE LINES  //////////////////////////////////////////////// */}
            {/* LEFT */}
            { type=='section' && (<span className=' text-[35px] mr-[30px] absolute right-[100%] top-[50%] translate-y-[-50%] flex items-center'>
                <hr className='w-[10vw] border-[1px] border-[#00000070] rounded-[10px] font-bold' />
            </span>)}
            {/* RIGHT */}
            { type=='section' && (<span className='text-[35px] ml-[30px] absolute left-[100%] top-[50%] translate-y-[-50%] flex items-center'>
            <hr className='w-[10vw] border-[1px] border-[#00000070] rounded-[10px] font-bold' />
            </span>)}


            {/* DELETE BUTTON  ///////////////////////////////////////////////////////////// */}
            {!dragctrl && (<div onClick={()=>{deletePoint(keyID); }}
            className='w-[20px] h-[20px] rounded-[50%] absolute top-0 left-[100%] hover:scale-[1.2] duration-[0.1s]
             translate-x-[-50%] translate-y-[-40%] text-white flex justify-center items-center'
             style={{cursor: 'pointer', background: bgColor!='#ff3e5fe5'? '#ff3e5f': '#892132'}}>
                    <RemoveRounded style={{color: 'white'}} />
            </div>)}

            {/* COLOUR CHANGE  /////////////////////////////////////////////////////// */}
            <AnimatePresence>
            {!dragctrl && type=='plot' && (
            
                <motion.div variants={colorsCont} initial={'hidden'} animate={'visible'} exit={'leave'} className='colorCont w-[150px] h-[20px] flex justify-evenly mt-[10px]'>
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
            </AnimatePresence>

        </motion.div>
     );
}
 
export default PlotElements;