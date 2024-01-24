import maleImage from '../assets/male.png'
import femaleImage from '../assets/female.png'
import { motion, AnimatePresence } from "framer-motion";
import { ZoomContext } from '../App.jsx'
import { useContext } from 'react'

const Protrait = () => {

    

    return ( 
        <div className="h-auto w-[100%] fixed z-[12] top-[50%] translate-y-[-50%] flex justify-around">
            <motion.img whileTap={{scale: 0.8}} src={maleImage} className='w-[40%] rounded-[30px]' alt="" />
            <motion.img whileTap={{scale: 0.8}} src={femaleImage} className='w-[40%] rounded-[30px]' alt="" />
        </div>
     );
}
 
export default Protrait;