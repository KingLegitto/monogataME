import { motion } from "framer-motion";

const JumboAlert = ({setJumboAlert}) => {
    return ( 
        <motion.div initial={{y: '0%', x: '-50%', opacity: 0}} animate={{y: '-50%', x: '-50%', opacity: 1}} transition={{type: 'spring'}} className="w-[95%] md:w-[40%] p-[20px] aspect-square fixed z-[100] left-[50%] top-[50%] text-center bg-[#ffffffec]
        rounded-[30px] flex justify-center items-center backdrop-blur-[10px]"
        style={{boxShadow: '0px 10px 33px -7px rgba(0,0,0,0.75)', fontSize: 'clamp(14px, 5vw,16px)'}}>
            Hey there. <br/> If you're seeing this and you're not me then I want you to know 
            this application is still in development and will be for a while.<br/>
            Many planned features are still in the works and quality of life changes will
            definitely be implemented along the way...

            <motion.button onClick={()=>{
                setTimeout(() => {
                    setJumboAlert(false)
                }, 700);
            }} whileTap={{scale: 0.7}} className="absolute w-[70%] md:w-[50%] bottom-[3%] sm:bottom-[20%] 
            bg-[#ff74c5] p-[7px] md:p-[10px] rounded-[30px]">
                Continue
            </motion.button>
        </motion.div>
     );
}
 
export default JumboAlert;