import maleImage from '../assets/male.png'
import femaleImage from '../assets/female.png'
import { motion, AnimatePresence } from "framer-motion";
import { ZoomContext } from '../App.jsx'
import { useContext } from 'react'

const Protrait = () => {

    

    return ( 
        <div className="h-auto w-[100%] lg:w-[50%] fixed z-[12] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] lg:translate-y-[-45%] flex justify-around">
            <div className='w-[40%] lg:w-auto h-auto flex flex-wrap justify-end'>
                <motion.img initial={{opacity: 0, x: '-50%'}} animate={{opacity: 1, x: 0, transition:{delay: 0.7, duration: 0.7}}} whileTap={{scale: 0.8}} src={maleImage} className='w-[100%] lg:max-w-[180px] rounded-[30px]' alt="" />

                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 1.5}} className='w-[100%] lg:max-w-[180px] Lora font-bold text-white mt-[10px] text-center'
                style={{fontSize: 'clamp(16px, 7vw,25px)'}}>Male</motion.div>
            </div>
            <div className='w-[40%] lg:w-auto h-auto flex flex-wrap justify-start'>
                <motion.img initial={{opacity: 0, x: '50%'}} animate={{opacity: 1, x: 0, transition:{delay: 0.7, duration: 0.7}}} whileTap={{scale: 0.8}} src={femaleImage} className='w-[100%] lg:max-w-[180px] rounded-[30px]' alt="" />

                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 1.5}} className='w-[100%] lg:max-w-[180px] Lora font-bold text-white mt-[10px] text-center'
                style={{fontSize: 'clamp(16px, 7vw,25px)'}}>Female</motion.div>
            </div>
            
        </div>
     );
}
 
export default Protrait;