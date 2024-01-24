import maleImage from '../assets/male.png'
import femaleImage from '../assets/female.png'
import { motion, AnimatePresence } from "framer-motion";
import { ZoomContext } from '../App.jsx'
import { useContext } from 'react'

const Protrait = () => {

    

    return ( 
        <div className="h-auto w-[100%] fixed z-[12] top-[50%] translate-y-[-50%] flex justify-around">
            <div className='w-[40%] h-auto flex flex-col items-center'>
                <motion.img whileTap={{scale: 0.8}} src={maleImage} className='w-[100%] rounded-[30px]' alt="" />

                <span className='Lora font-bold text-white mt-[10px]'
                style={{fontSize: 'clamp(16px, 7vw,25px)'}}>Male</span>
            </div>
            <div className='w-[40%] h-auto flex flex-col items-center'>
                <motion.img whileTap={{scale: 0.8}} src={femaleImage} className='w-[100%] rounded-[30px]' alt="" />

                <span className='Lora font-bold text-white mt-[10px]'
                style={{fontSize: 'clamp(16px, 7vw,25px)'}}>Female</span>
            </div>
            
        </div>
     );
}
 
export default Protrait;