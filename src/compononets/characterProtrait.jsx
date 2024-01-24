import maleImage from '../assets/male.png'
import femaleImage from '../assets/female.png'
import { motion, AnimatePresence } from "framer-motion";
import { ZoomContext } from '../App.jsx'
import { useContext } from 'react'

const Protrait = () => {

    

    return ( 
        <div className="h-auto w-[100%] fixed z-[12] top-[50%] translate-y-[-50%] flex justify-around">
            <div className='w-[40%] h-auto flex flex-col items-center'>
                <motion.img initial={{opacity: 0, x: '-50%'}} animate={{opacity: 1, x: 0}} transition={{delay: 0.7}} whileTap={{scale: 0.8}} src={maleImage} className='w-[100%] rounded-[30px]' alt="" />

                <motion.span initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 1.5}} className='Lora font-bold text-white mt-[10px]'
                style={{fontSize: 'clamp(16px, 7vw,25px)'}}>Male</motion.span>
            </div>
            <div className='w-[40%] h-auto flex flex-col items-center'>
                <motion.img initial={{opacity: 0, x: '50%'}} animate={{opacity: 1, x: 0}} transition={{delay: 1}} whileTap={{scale: 0.8}} src={femaleImage} className='w-[100%] rounded-[30px]' alt="" />

                <motion.span initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 1.5}} className='Lora font-bold text-white mt-[10px]'
                style={{fontSize: 'clamp(16px, 7vw,25px)'}}>Female</motion.span>
            </div>
            
        </div>
     );
}
 
export default Protrait;