import maleImage from '../assets/portraitImgs/gender/male.png'
import femaleImage from '../assets/portraitImgs/gender/female.png'
import babyImg from '../assets/portraitImgs/body/baby.png'
import teenImg from '../assets/portraitImgs/body/teen.png'
import eye1 from '../assets/portraitImgs/eye/eye1.png'
import eye2 from '../assets/portraitImgs/eye/eye2.png'
import eye3 from '../assets/portraitImgs/eye/eye3.png'
import eye4 from '../assets/portraitImgs/eye/eye4.png'
import { motion, AnimatePresence } from "framer-motion";
import { ZoomContext } from '../App.jsx'
import { useContext } from 'react'
import { useState, useEffect } from 'react';

const Protrait = () => {
    const [preview, setPreview] = useState(false)
    const [ageBracketSelection, setAgeBracketSelection] = useState()
    const [eyeSelection, setEyeSelection] = useState()

    const [ageBracketChoices, setAgeBracketChoices] = useState([
        {name: 'Baby', img: babyImg, level: 1},
        {name: 'Teen', img: teenImg, level: 1},
        {name: 'Next', img: 'next', level: 1}
    ])
    const [eyeChoices, setEyeChoices] = useState([
        {name: 'Go back', img: 'back', level: 2},
        {name: 'Eyes 1', img: eye1, level: 2},
        {name: 'Eyes 2', img: eye2, level: 2},
        {name: 'Eyes 3', img: eye3, level: 2},
        {name: 'Eyes 4', img: eye4, level: 2},
        {name: 'Next', img: 'next', level: 2},
    ])

    const [choices, setChoices] = useState(ageBracketChoices)

    function makeSelection(level, img){
        switch(level){
            case 1:{
                if(img == 'next'){
                    setChoices(eyeChoices)
                }
                else{
                    setAgeBracketSelection(img)
                }
                break
            }
            case 2:{
                if(img == 'back'){
                    setChoices(ageBracketChoices)
                    setEyeSelection()
                }else{
                    setEyeSelection(img)
                }
                
                break
            }
        }
    }

    useEffect(()=>{
        // if(!preview){
        //     document.querySelector('.header').style.transform = 'translateY(-100%)'
        // }
    }, [])
    

    return ( 

        <>
        {/* GENDER ///////////////////////////////// */}
        {!preview && (<div className="h-auto w-[100%] lg:w-[50%] fixed z-[12] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] lg:translate-y-[-45%] flex justify-around">
            <div className='w-[40%] lg:w-auto h-auto flex flex-wrap justify-end'>
                
                <motion.img initial={{opacity: 0, x: '-50%'}} animate={{opacity: 1, x: 0, transition:{delay: 0.7, duration: 0.7}}} whileTap={{scale: 0.8}} src={maleImage} 
                className='w-[100%] lg:max-w-[180px] rounded-[30px]' alt="" onClick={()=>{setPreview(true)}}/>

                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 1.5}} className='w-[100%] lg:max-w-[180px] Lora font-bold text-white mt-[10px] text-center'
                style={{fontSize: 'clamp(16px, 7vw,25px)'}}>Male</motion.div>

            </div>
            <div className='w-[40%] lg:w-auto h-auto flex flex-wrap justify-start'>
                
                <motion.img initial={{opacity: 0, x: '50%'}} animate={{opacity: 1, x: 0, transition:{delay: 0.7, duration: 0.7}}} whileTap={{scale: 0.8}} src={femaleImage} 
                className='w-[100%] lg:max-w-[180px] rounded-[30px]' alt="" />

                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 1.5}} className='w-[100%] lg:max-w-[180px] Lora font-bold text-white mt-[10px] text-center'
                style={{fontSize: 'clamp(16px, 7vw,25px)'}}>Female</motion.div>

            </div>
            
            
        </div>)}

        
        {preview && (<div className='w-[100%] fixed z-[12] top-[50%] translate-y-[-50%] h-[85vh] lg:h-[100vh]'>

            {/* LEVEL ////////////////////////////////////////////////////// */}
            <div>

            </div>


            {/* PORTRAIT DISPLAY //////////////////////////////////////////// */}
            <div className='absolute top-[50%] lg:top-[55%] left-[50%] lg:left-[30%] translate-x-[-50%] translate-y-[-50%] w-[90%] md:w-[400px] rounded-[30px] bg-white'
            style={{aspectRatio: '1/1.065', backgroundImage: `url(${ageBracketSelection})`, backgroundPosition: 'center', backgroundSize: 'contain'}} >

                <div className='w-[100%] h-[100%] rounded-[30px]'
                style={{backgroundImage: `url(${eyeSelection})`, backgroundPosition: 'center', backgroundSize: 'contain'}} >
                    
                </div>
            </div>


            {/* AVAILABLE CHOICES */}
            <div className='absolute w-[100%] px-[10px] md:w-[450px] flex flex-wrap justify-start lg:left-[50%] top-[85%] lg:top-[50%] translate-y-[0%] lg:translate-y-[-50%]'>
                {choices.map((choice)=>{
                    return(
                        <div className='rounded-[20px] m-[5px]  w-[70px] h-[40px] flex justify-center items-center bg-white' 
                        style={{cursor: 'pointer'}} onClick={()=>{makeSelection(choice.level, choice.img)}}>
                            {choice.name}
                        </div>
                    )
                })}
            </div>

        </div>)}
        </>
        
     );
}
 
export default Protrait;