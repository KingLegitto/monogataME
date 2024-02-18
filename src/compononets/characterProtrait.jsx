import maleImage from '../assets/portraitImgs/gender/male.png'
import femaleImage from '../assets/portraitImgs/gender/female.png'
import babyBase from '../assets/portraitImgs/body/baby_.png'
import teenBase from '../assets/portraitImgs/body/teen_male.png'
import eye1 from '../assets/portraitImgs/eye/eye1_.png'
import eye2 from '../assets/portraitImgs/eye/eye2_.png'
import eye3 from '../assets/portraitImgs/eye/eye3_.png'
import eye4 from '../assets/portraitImgs/eye/eye4_.png'
import skin1 from '../assets/portraitImgs/skin/skin1_.png'
import skin2 from '../assets/portraitImgs/skin/skin2_.png'
import skin3 from '../assets/portraitImgs/skin/skin3_.png'
import exp from '../assets/portraitImgs/expression/express.png'
import babyExp from '../assets/portraitImgs/expression/baby_express.png'
import spikyHairL from '../assets/portraitImgs/hair/spikyL.png'
import spikyHairC from '../assets/portraitImgs/hair/spikyC.png'
import flatishTopL from '../assets/portraitImgs/hair/flatishTopL.png'
import flatishTopC from '../assets/portraitImgs/hair/flatishTopC.png'
import { motion, AnimatePresence } from "framer-motion";
import { ZoomContext } from '../App.jsx'
import { useContext } from 'react'
import { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';

const Protrait = ({setPortrait, characterNum, characters, setBgOverlay}) => {
    const [preview, setPreview] = useState(false)
    const [loading, setLoading] = useState(true)
    const [hBox, setHBox] = useState()
    const [wBox, setWBox] = useState()
    const [skinSelection, setSkinSelection] = useState(skin2)
    const [ageBracketSelection, setAgeBracketSelection] = useState(babyBase)
    const [eyeSelection, setEyeSelection] = useState(eye1)
    const [expSelection, setExpSelection] = useState(ageBracketSelection==babyBase?babyExp:exp)
    const [hairSelection, setHairSelection] = useState()

    // CHOICES ///////////////////////////////////////////////////////////////
    const [ageBracketChoices, setAgeBracketChoices] = useState([
        {name: 'Baby', img: babyBase, level: 1},
        {name: 'Teen', img: teenBase, level: 1},
        {name: 'Next', img: 'next', level: 1}
    ])
    const [skinChoices, setSkinChoices] = useState([
        {name: 'Go back', img: 'back', level: 2},
        {name: 'Skin 1', img: skin1, level: 2},
        {name: 'Skin 2', img: skin2, level: 2},
        {name: 'Skin 3', img: skin3, level: 2},
        {name: 'Next', img: 'next', level: 2},
    ])
    const [eyeChoices, setEyeChoices] = useState([
        {name: 'Go back', img: 'back', level: 3},
        {name: 'Eyes 1', img: eye1, level: 3},
        {name: 'Eyes 2', img: eye2, level: 3},
        {name: 'Eyes 3', img: eye3, level: 3},
        {name: 'Eyes 4', img: eye4, level: 3},
        {name: 'Next', img: 'next', level: 3},
    ])
    const [expressChoices, setExpressChoices] = useState([
        {name: 'Go back', img: 'back', level: 4},
        {name: 'Expr 1', img: ageBracketSelection==babyBase?babyExp:exp, level: 4},
        {name: 'Next', img: 'next', level: 4},
    ])
    const [hairChoices, setHairChoices] = useState([
        {name: 'Go back', img: 'back', level: 5},
        {name: 'Bald', img: null, level: 5},
        {name: 'Spiky', img: spikyHairL, level: 5},
        {name: 'FlatT', img: flatishTopL, level: 5},
        {name: 'Next', img: 'next', level: 5},
    ])

    const [choices, setChoices] = useState(ageBracketChoices)

    function makeSelection(level, img){
        
        
        switch(level){
            case 1:{
                if(img == 'next'){
                    setChoices(skinChoices)
                }
                else{
                    if(ageBracketSelection != img){
                        setLoading(true)
                    }
                    setAgeBracketSelection(img)
                    
                }
                break
            }
            case 2:{
                if(img == 'next'){
                    setChoices(eyeChoices)
                }
                else if(img == 'back'){
                    setChoices(ageBracketChoices)
                }else{
                    if(skinSelection != img){
                        setLoading(true)
                    }
                    
                    setSkinSelection(img)
                } 
                break
            }
            case 3:{
                if(img == 'next'){
                    setChoices(expressChoices)
                }
                else if(img == 'back'){
                    setChoices(skinChoices)
                    setEyeSelection(eye1)
                }else{
                    if(eyeSelection != img){
                        setLoading(true)
                    }
                    
                    setEyeSelection(img)
                } 
                break
            }
            case 4:{
                if(img == 'next'){
                    setChoices(hairChoices)
                }
                else if(img == 'back'){
                    setChoices(eyeChoices)
                }else{
                    if(expSelection != img){
                        setLoading(true)
                    }
                    
                    setExpSelection(img)
                } 
                break
            }
            case 5:{
                if(img == 'back'){
                    setChoices(expressChoices)
                
                }
                else if(img == 'next'){
                    let portrait = document.querySelector('.portraitBox')
                    html2canvas(portrait).then(function(canvas) {
                        let characterUrl = canvas.toDataURL()
                        setImage(characterNum, characterUrl)
                    });
                }
                else{
                    if(hairSelection != img && img != null){
                        setLoading(true)
                    }
                    
                    setHairSelection(img)  
                } 
                break
            }
        }
    }

    function setImage(num, url){
        characters[num].portrait = url
        setPortrait(false)
        setBgOverlay(false)
    }

    useEffect(()=>{
        setExpSelection(ageBracketSelection==babyBase?babyExp:exp)
    }, [ageBracketSelection])

    useEffect(()=>{
        if(preview){
            const img_ = new Image()
        img_.src = hairSelection==spikyHairL?spikyHairC:
                   hairSelection==flatishTopL?flatishTopC:''
    
    
        const canvas = document.getElementById('canvas')
    
        const ctx = canvas.getContext('2d')
        
        ctx.clearRect(0,0,wBox,hBox)
        img_.onload = ()=>{
            ctx.drawImage(img_,0,0, 720, 767, -2, -1, wBox, hBox)
            setLoading(false)
            // const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            // const data = imageData.data
    
            // for (let i = 0; i < data.length; i += 4){
            //     data[i] = data[i]==0?0:101;
            //     data[i+1] = data[i+1]==0?0:255;
            //     data[i+2] = data[i+2]==0?0:204;
            // }
            // ctx.putImageData(imageData, 0, 0)
        }
        }
    }, [hairSelection])

    useEffect(()=>{
        if(preview){
            let h = document.querySelector('.portraitBox').getBoundingClientRect().height

            let w = document.querySelector('.portraitBox').getBoundingClientRect().width

            setHBox(h)
            setWBox(w)

        
        }
       
    }, [preview])
    
    useEffect(()=>{
        if(preview){
            const img_ = new Image()
        img_.src = hairSelection==spikyHairL?spikyHairC:
                   hairSelection==flatishTopL?flatishTopC:''
    
        const canvas = document.getElementById('canvas')
    
        const ctx = canvas.getContext('2d')
    
        img_.onload = ()=>{
            ctx.drawImage(img_,0,0, 720, 767, 0, 0, wBox, hBox)
            
        }
        }
        
    }, [hBox])

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

        {/* PORTRAIT PARENT ///////////////////////////////////// */}
        {preview && (<div className='w-[100%] fixed z-[12] bottom-[5%] lg:top-[50%]  lg:translate-y-[-50%] h-[92dvh] lg:h-[100vh]'>

            {/* LEVEL ////////////////////////////////////////////////////// */}
            <div>

            </div>


            {/* PORTRAIT DISPLAY //////////////////////////////////////////// */}
            <div className='absolute portraitBox top-[50%] lg:top-[55%] left-[50%] lg:left-[30%] translate-x-[-50%] translate-y-[-50%] w-[90%] md:w-[400px] rounded-[30px] bg-white'
            style={{aspectRatio: '1/1.065', border: '2px solid white', boxShadow: '0px 0px 9px 0px rgba(255,255,255,0.75)'}}>

                {/* LOADING SCREEN ////////////////////////////////////// */}
                <div className='w-[100%] h-[100%] rounded-[30px] absolute z-[10] bg-[#151515fa] justify-center items-center text-white'
                style={{display: loading?'flex':'none'}}>
                    Loading...
                </div>

                {/* SKIN LAYER ////////////////////////////////////////// */}
                <img className='w-[100%] h-[100%] rounded-[30px] absolute z-[1]' src={skinSelection} onLoad={()=>{setLoading(false)}}
                style={{objectPositionPosition: 'center', objectFit: 'contain'}} />  

                {/* AGE BRACKET LAYER ////////////////////////////////////////////// */}
                <img className='w-[100%] h-[100%] rounded-[30px] absolute z-[2]' src={ageBracketSelection} onLoad={()=>{setLoading(false)}}
                style={{objectPositionPosition: 'center', objectFit: 'contain'}} />   
                
                {/* EYE LAYER /////////////////////////////////////////////////// */}
                <img className='w-[100%] h-[100%] rounded-[30px] absolute z-[3]' src={eyeSelection} onLoad={()=>{setLoading(false)}}
                style={{objectPositionPosition: 'center', objectFit: 'contain'}} />
                
                {/* EXPRESSION LAYER /////////////////////////////////////// */}
                <img className='w-[100%] h-[100%] rounded-[30px] absolute z-[4]' src={expSelection} onLoad={()=>{setLoading(false)}}
                style={{objectPositionPosition: 'center', objectFit: 'contain'}} />


                {/* HAIR LAYER ///////////////////////////////////////////// */}
                <canvas width={wBox} height={hBox} id='canvas' className='absolute z-[5]'>

                </canvas>
                {hairSelection && (<img className='w-[100%] h-[100%] rounded-[30px] absolute z-[6]' src={hairSelection} onLoad={()=>{setLoading(false)}}
                style={{objectPositionPosition: 'center', objectFit: 'contain'}} />)}

            </div>


            {/* AVAILABLE CHOICES */}
            <div className='absolute w-[100%] px-[10px] md:w-[450px] flex flex-wrap justify-start lg:left-[50%] top-[85%] lg:top-[50%] translate-y-[0%] lg:translate-y-[-50%]'>
                {choices.map((choice, i)=>{
                    return(
                        <motion.div key={`${choice.name}${choice.level}`} initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1, transition:{delay: i*0.1}}}
                        className={`rounded-[20px] m-[5px] w-[70px] h-[40px] flex justify-center items-center bg-white`} 
                        style={{cursor: 'pointer', backgroundColor: choice.img==ageBracketSelection||choice.img==skinSelection||choice.img==eyeSelection||choice.img==expSelection||choice.img==hairSelection? '#ff74c5':'white',
                        color: choice.img==ageBracketSelection||choice.img==skinSelection||choice.img==eyeSelection||choice.img==expSelection||choice.img==hairSelection? 'white':'black', transition: '0.2s'}} 
                        onClick={()=>{makeSelection(choice.level, choice.img)}}>
                            {choice.name}
                        </motion.div>
                    )
                })}
            </div>

        </div>)}
        </>
        
     );
}
 
export default Protrait;