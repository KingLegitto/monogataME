import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from 'react'

const JumboAlert = ({setJumboAlert, setBgOverlay,jumboAlert,setShowPoints}) => {
    const [btn, setBtn] = useState(true)
    const modal ={
        hidden: {
            y: '-50%',
            x: '-50%',
            opacity: 0,
            scale: 1.2
        },
        visible: {
            y: '-50%',
            x: '-50%',
            opacity: 1,
            scale: 1
        }
    }

    const button = {
        hidden: {
           
            opacity: 0,
            
        },
        visible: {
           
            opacity: 1,
            
        },

        clicked: {
            opacity: 1,
            scale: [1, 0.7, 1, 1],
            transition: {duration: 0.5, scale:{duration: 1, times: [0, 0.1, 0.5, 1]} }
        }
    }
    return (
        <>
         

        <motion.div variants={modal} initial={'hidden'} animate={'visible'} 
        exit={{opacity: 0, transition:{duration: 0.5, delay: 0.5}}} transition={{duration: 0.3}} 
        className="w-[95%] md:w-[40%] p-[25px] lg:p-[50px] aspect-square fixed z-[100] left-[50%] top-[50%] text-center bg-[#ffffffec]
        lg:rounded-[100px] rounded-[50px] flex flex-col justify-center items-center"
        style={{boxShadow: '0px 10px 33px -7px rgba(0,0,0,0.75)', fontSize: 'clamp(14px, 5vw,16px)'}}>
            <span style={{fontSize: 'clamp(16px, 7vw,22px)'}} className="Rubik mb-[10px]">Hi there.</span>  
            This application is still in development and will be for a while.<br/>
            Many planned features are still in the works and quality of life changes will
            definitely be implemented along the way...

            <AnimatePresence>
            {innerWidth>768 && btn && (<motion.button variants={button} initial={'hidden'} animate={'visible'} exit={'clicked'} transition={{delay: 3}}
            onClick={()=>{
                setBtn(false)

                setTimeout(() => {
                    setTimeout(() => {
                        setShowPoints(true)
                    }, 1000);
                    

                    setJumboAlert(false)
            
                
                    setBgOverlay(false)
                }, 500);
                
           
            }} className="initialBtn absolute w-[70%] md:w-[50%] bottom-[3%] sm:bottom-[20%] 
            bg-[#ff74c5] p-[7px] md:p-[10px] rounded-[30px] text-[white] Rubik">
                Continue
            </motion.button>)}
            </AnimatePresence>
            
        </motion.div>


        {innerWidth<=768 && (<motion.button initial={{x: '-50%', opacity: 0}} animate={{x:'-50%', opacity: 1}} transition={{delay: 3}} 
        exit={{opacity: 0, transition:{duration: 0.5, delay: 0.1}}} onClick={()=>{
            setTimeout(() => {
                setJumboAlert(false)
                setBgOverlay(false)
            }, 300);
        }} className="initialBtn absolute z-[100] left-[50%] w-[70%] md:w-[50%] bottom-[10%] sm:bottom-[20%] 
        bg-[#ff74c5] p-[7px] md:p-[10px] rounded-[30px] text-[white] Rubik">
            Continue
        </motion.button>)}
        </>
     );
}
 
export default JumboAlert;