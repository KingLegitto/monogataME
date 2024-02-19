import { Download, Edit } from '@mui/icons-material';
import {motion} from 'framer-motion'
import { useRef,useEffect} from 'react';

const Viewer = ({viewer, setViewer, targetImg, setBgOverlay, setPortrait, nameToSend}) => {
    useEffect(()=>{
        if(viewer){
            
            setTimeout(()=>{
                
                document.addEventListener('click', viewerToggle)
            },1000)
        }
        
    }, [viewer])
    
    const viewerToggle = (event)=>{
        // alert('Modal')
        if(viewerRef.current && !viewerRef.current.contains(event.target)){
            
            setViewer(false)
            setBgOverlay(false)
            
            document.removeEventListener('click', viewerToggle)
        }
    }

    const viewerRef = useRef(null)
    
    return ( 
        <motion.div ref={viewerRef} initial={{x: '-50%', y: '100%', opacity: 0}} animate={{ x: '-50%',y: '-50%', opacity: 1}}
        transition={{type: 'spring', stiffness: 100}} exit={{ y: '100%', transition:{type: 'tween', duration: 0.3}}} 
        className=" w-[90%] md:w-[400px] rounded-[30px] border-[2px] z-[81] fixed top-[50%] left-[50%] overflow-hidden"
        style={{aspectRatio: '1/1.065', backgroundImage: `url(${targetImg})`, backgroundPosition: 'center', backgroundSize: '100%'}}>
            {/* <div className="viewOptions">
                
            </div> */}
            <div className='absolute h-auto w-auto bottom-0 right-0'>
                <a href={targetImg} download={nameToSend} className="viewOptions ">
                    <Download />
                </a>
                <button className="viewOptions" onClick={()=>{setViewer(false), setPortrait(true)}}>
                    <Edit />
                </button>
            </div>
            
        </motion.div>
     );
}
 
export default Viewer;