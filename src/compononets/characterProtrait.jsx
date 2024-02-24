import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { useSelector, useDispatch } from "react-redux";
import { placeImage } from '../redux/reduxStates.js';
import {
    maleImage, femaleImage, babyBase, babyBaseSH, teenMBase, teenMBaseSH, adultFBase, adultFBaseC,
    eye1, eye2, eye3, eye4, skin1, skin2, skin3, exp, babyExp, confidentExp, grinExp, determinedExp,
    indiffExp, seriousExp, spikyHairL, spikyHairC, flatishTopL, flatishTopC, longBangsL, longBangsC,
    afroFL, afroFC
} from './portraitImports.js'

const Protrait = ({setPortrait, characterNum, setBgOverlay}) => {
    const { characters } = useSelector((state) => state.overallStates)
    const dispatch = useDispatch()

    const [preview, setPreview] = useState(false)
    const [gender, setGender] = useState()
    const [loading, setLoading] = useState(true)
    const [hBox, setHBox] = useState()
    const [wBox, setWBox] = useState()
    const [skinSelection, setSkinSelection] = useState(skin2)
    const [ageBracketSelection, setAgeBracketSelection] = useState(babyBase)
    const [eyeSelection, setEyeSelection] = useState(gender=='male'?eye1:eye2)
    const [expSelection, setExpSelection] = useState(ageBracketSelection==babyBase?babyExp:exp)
    const [hairSelection, setHairSelection] = useState()
    const [hairColorSelection, setHairColorSelection] = useState([19,37,45])
    const [clothesCurrentC, setClothesCurrentC] = useState([229,68,157])
    const [clothesOldC, setClothesOldC] = useState([229,68,157])
    const [clothesNewC, setClothesNewC] = useState([201,20,20])
    const [normalize, setNormalize] = useState(false)
    const [allClear, setAllClear] = useState(false)

    // CHOICES ///////////////////////////////////////////////////////////////
    const [ageBracketChoices, setAgeBracketChoices] = useState([
        {name: 'Baby', img: babyBase, level: 1},
        {name: 'Teen', img: teenMBase, level: 1},
        {name: 'Next', img: 'next', level: 1},
    ])
    const [ageBracketChoicesF, setAgeBracketChoicesF] = useState([
        {name: 'Baby', img: babyBase, level: 1},
        {name: 'Adult', img: adultFBase, level: 1},
        {name: 'Next', img: 'next', level: 1}
    ])
    const [skinChoices, setSkinChoices] = useState([
        {name: 'Go back', img: 'back', level: 2},
        {name: 'Dark', img: skin1, level: 2},
        {name: 'Brown', img: skin2, level: 2},
        {name: 'White', img: skin3, level: 2},
        {name: 'Next', img: 'next', level: 2},
    ])
    const [eyeChoices, setEyeChoices] = useState([
        {name: 'Go back', img: 'back', level: 3},
        {name: 'Basic', img: eye1, level: 3},
        {name: 'Basic ♀️', img: eye2, level: 3},
        {name: 'Closed', img: eye3, level: 3},
        {name: 'Half closed', img: eye4, level: 3},
        {name: 'Next', img: 'next', level: 3},
    ])
    const [expressChoices, setExpressChoices] = useState([
        {name: 'Go back', img: 'back', level: 4},
        {name: 'Smile', img: exp, level: 4},
        {name: 'Grin', img: grinExp, level: 4},
        {name: 'Determined', img: determinedExp, level: 4},
        {name: 'Confident', img: confidentExp, level: 4},
        {name: 'Serious', img: seriousExp, level: 4},
        {name: 'Indifferent', img: indiffExp, level: 4},
        {name: 'Next', img: 'next', level: 4},
    ])
    const [expressChoicesBaby, setExpressChoicesBaby] = useState([
        {name: 'Go back', img: 'back', level: 4},
        {name: 'Smile', img: babyExp, level: 4},
        {name: 'Next', img: 'next', level: 4},
    ])
    const [clothesColors, setClothesColors] = useState([
        {name: 'Go back', img: 'back', level: 4.5},
        {name: 'Hot Pink', img: [229,68,157], level: 4.5},
        {name: 'Black', img: [25,25,25], level: 4.5},
        {name: 'Red', img: [201,20,20], level: 4.5},
        {name: 'Next', img: 'next', level: 4.5},
    ])
    const [hairChoices, setHairChoices] = useState([
        {name: 'Go back', img: 'back', level: 5},
        {name: 'Bald', img: null, level: 5},
        {name: 'Spiky', img: spikyHairL, level: 5},
        {name: 'Flatish Top', img: flatishTopL, level: 5},
        {name: 'Next', img: 'next', level: 5},
    ])
    const [hairChoicesF, setHairChoicesF] = useState([
        {name: 'Go back', img: 'back', level: 5},
        {name: 'Bald', img: null, level: 5},
        {name: 'Spiky', img: spikyHairL, level: 5},
        {name: 'Long(Bangs)', img: longBangsL, level: 5, check: 'notForBaby'},
        {name: 'Afro', img: afroFL, level: 5, check: 'notForBaby'},
        {name: 'Next', img: 'next', level: 5},
    ])
    const [hairColors, setHairColors] = useState([
        {name: 'Go back', img: 'backToHair', level: 5},
        {name: 'Dark blue', img: [19,37,45], level: 5},
        {name: 'Black', img: [25,25,25], level: 5},
        {name: 'White', img: [229,243,255], level: 5},
        {name: 'Blonde', img: [255,232,140], level: 5 },
        {name: 'Green', img: [175,255,155], level: 5 },
        {name: 'Pale red', img: [204,110,113], level: 5 },
        {name: 'Blue', img: [110,177,204], level: 5 },
        {name: 'Brown', img: [102,69,51], level: 5},
        {name: 'Finish', img: 'Finish', level: 5},
    ])

    const [choices, setChoices] = useState(gender=='male'?ageBracketChoices:ageBracketChoicesF)

    useEffect(()=>{
        if(gender=='male'){
            setChoices(ageBracketChoices)
            setEyeSelection(eye1)
        }
    }, [gender])
    // LOGIC TO REMOVE AVAILABLE CHOICES THAT SHOULD NOT BE AVAILABLE
    useEffect(()=>{
        if(preview){
            choices.forEach((option)=>{
                if(option.check){
                    switch(option.check){
                        case 'notForBaby':
                            if(ageBracketSelection==babyBase){
                                let refresh = choices.filter((item)=>(item.img!=option.img))
                                setChoices(refresh)
                            }break;
                        case 'notForMale':
                            if(gender=='male'){
                                let refresh = choices.filter((item)=>(item.img!=option.img))
                                setChoices(refresh)
                            }break;
                    }
                }
            })
        }
    }, [choices])

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
                    setChoices(gender=='male'?ageBracketChoices:ageBracketChoicesF)
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
                    setChoices(ageBracketSelection==babyBase?expressChoicesBaby:expressChoices)
                }
                else if(img == 'back'){
                    setChoices(skinChoices)
                    // setEyeSelection(eye1)
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
                    setChoices(clothesColors)
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
            case 4.5:{
                if(img == 'next'){
                    setChoices(gender=='male'?hairChoices:hairChoicesF)
                }
                else if(img == 'back'){
                    setChoices(ageBracketSelection==babyBase?expressChoicesBaby:expressChoices)
                }else{
                    // if(expSelection != img){
                    //     setLoading(true)
                    // }
                    setClothesCurrentC(clothesNewC)
                    setClothesNewC(img)
                } 
                break
            }
            case 5:{
                if(img == 'back'){
                    setChoices(clothesColors)
                
                }
                else if(img == 'backToHair'){
                    setChoices(gender=='male'?hairChoices:hairChoicesF)
                
                }
                else if(img == 'next'){
                    setChoices(hairColors)
                }
                else if(img == 'Finish'){
                    setNormalize(true)
                    
                }
                else{
                    if(hairSelection != img && img != null && choices != hairColors){
                        setLoading(true)
                    }
                    
                    choices==hairColors?setHairColorSelection(img):setHairSelection(img)  
                } 
                break
            }
        }
    }

    function setImage(num, url){
        dispatch(placeImage([num, url]))
        // characters[num].portrait = url
        setPortrait(false)
        setBgOverlay(false)
        
    }

    useEffect(()=>{
        if(allClear){
            
                let portrait = document.querySelector('.portraitBox')
                    html2canvas(portrait).then(function(canvas) {
                        
                        let characterUrl = canvas.toDataURL()
                        setImage(characterNum, characterUrl)
                    });
            
        }
    }, [allClear])

    useEffect(()=>{
        setExpSelection(ageBracketSelection==babyBase?babyExp:exp)
    }, [ageBracketSelection])

    useEffect(()=>{
        if(preview){
            const hairImg = new Image()

        hairImg.src = hairSelection==spikyHairL?spikyHairC:
                   hairSelection==flatishTopL?flatishTopC:
                   hairSelection==longBangsL?longBangsC:
                   hairSelection==afroFL?afroFC:''

        const clothes = new Image()
        clothes.src = ageBracketSelection==adultFBase?adultFBaseC:''

        const skinImg = new Image()
        const skinH = new Image()
        skinImg.src = skinSelection
        skinH.src = ageBracketSelection==babyBase?babyBaseSH:
                    ageBracketSelection==teenMBase||ageBracketSelection==adultFBase?teenMBaseSH:''
    
        const canvas = document.getElementById('canvas')
        const ctx = canvas.getContext('2d')
        
        ctx.clearRect(0,0,wBox,hBox)
        // ctx.globalCompositeOperation = "lighter"
        hairImg.onload = ()=>{
            ctx.drawImage(hairImg,0,0, 720, 767, -2, -1, wBox, hBox)
            // setLoading(false)
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const data = imageData.data
    
            for (let i = 0; i < data.length; i += 4){
                data[i] = hairColorSelection[0];
                data[i+1] = hairColorSelection[1];
                data[i+2] = hairColorSelection[2];
            }
            ctx.putImageData(imageData, 0, 0)
        }

        const canvas2 = document.getElementById('clothesCanvas')
        const ctxClothes = canvas2.getContext('2d')

        ctxClothes.clearRect(0,0,wBox,hBox)
        clothes.onload = ()=>{
            ctxClothes.drawImage(clothes,0,0, 720, 767, -2, -3, wBox, hBox)
            // setLoading(false)
            const imageData = ctxClothes.getImageData(0, 0, canvas.width, canvas.height)
            const data = imageData.data
    
            for (let i = 0; i < data.length; i += 4){
                data[i] = data[i]!=clothesCurrentC[0]?clothesNewC[0] + red(data[i]):clothesNewC[0];
                data[i+1] = data[i+1]!=clothesCurrentC[1]?clothesNewC[1] + green(data[i+1]):clothesNewC[1];
                data[i+2] = data[i+2]!=clothesCurrentC[2]?clothesNewC[2] + blue(data[i+2]):clothesNewC[2];
            }
            ctxClothes.putImageData(imageData, 0, 0)
        }

        const canvas3 = document.getElementById('skinCanvas')
        const ctxSkin = canvas3.getContext('2d')

        ctxSkin.clearRect(0,0,wBox,hBox)
        ctxSkin.globalCompositeOperation = "lighter"
        skinImg.onload = ()=>{
            ctxSkin.drawImage(skinImg,0,0, 720, 767, -2, -3, wBox, hBox)
            setLoading(false)
            setAllClear(normalize?true:false)
        }
        skinH.onload = ()=>{
            ctxSkin.drawImage(skinH,0,0, 720, 767, -2, -2, wBox, hBox)
            // setLoading(false)
        }

        }
    }, [hairSelection, ageBracketSelection, skinSelection, hairColorSelection, wBox, clothesNewC])

    function red(val){
        let diff = val - 229
        return diff
    }
    function green(val){
        let diff = val - 68
        return diff
    }
    function blue(val){
        let diff = val - 157
        return diff
    }

    useEffect(()=>{
        if(preview){
            let h = document.querySelector('.portraitBox').getBoundingClientRect().height

            let w = document.querySelector('.portraitBox').getBoundingClientRect().width

            setHBox(h)
            setWBox(w)

        
        }
       
    }, [preview, normalize])
    
    useEffect(()=>{
        if(preview){

        // const hairImg = new Image()

        // hairImg.src = hairSelection==spikyHairL?spikyHairC:
        //            hairSelection==flatishTopL?flatishTopC:
        //            hairSelection==longBangsL?longBangsC:
        //            hairSelection==afroFL?afroFC:''

        // const skinImg = new Image()
        // const skinH = new Image()
        // skinImg.src = skinSelection
        // skinH.src = ageBracketSelection==babyBase?babyBaseSH:
        //             ageBracketSelection==teenMBase||ageBracketSelection==adultFBase?teenMBaseSH:''
    
        // const canvas = document.getElementById('canvas')
        // const ctx = canvas.getContext('2d')
    
        // ctx.clearRect(0,0,wBox,hBox)
        // hairImg.onload = ()=>{
        //     ctx.drawImage(hairImg,0,0, 720, 767, -2, -1, wBox, hBox)
        //     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        //     const data = imageData.data
    
        //     for (let i = 0; i < data.length; i += 4){
        //         data[i] = hairColorSelection[0];
        //         data[i+1] = hairColorSelection[1];
        //         data[i+2] = hairColorSelection[2];
        //     }
        //     ctx.putImageData(imageData, 0, 0)
        // }

        // const canvas3 = document.getElementById('skinCanvas')
        // const ctxSkin = canvas3.getContext('2d')

        // ctxSkin.clearRect(0,0,wBox,hBox)
        // ctxSkin.globalCompositeOperation = "lighter"
       
        // skinImg.onload = ()=>{
        //     ctxSkin.clearRect(0,0,wBox,hBox)
        //     ctxSkin.drawImage(skinImg,0,0, 720, 767, -2, -3, wBox, hBox)
        //     ctxSkin.drawImage(skinH,0,0, 720, 767, -2, -1, wBox, hBox)
        //     setAllClear(normalize?true:false)
        // }
        // skinH.onload = ()=>{
        //     ctxSkin.clearRect(0,0,wBox,hBox)
        //     ctxSkin.drawImage(skinImg,0,0, 720, 767, -2, -3, wBox, hBox)
        //     ctxSkin.drawImage(skinH,0,0, 720, 767, -2, -1, wBox, hBox)
        //     setAllClear(normalize?true:false)
        //     // setLoading(false)
        // }
        
        
        }
        
    }, [wBox])

    return ( 

        <>
        {/* GENDER ///////////////////////////////// */}
        {!preview && (<div className="h-auto w-[100%] lg:w-[50%] fixed z-[12] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] lg:translate-y-[-45%] flex justify-around">
            <div className='w-[40%] lg:w-auto h-auto flex flex-wrap justify-end'>
                
                <motion.img initial={{opacity: 0, x: '-50%'}} animate={{opacity: 1, x: 0, transition:{delay: 0.7, duration: 0.7}}} whileTap={{scale: 0.8}} src={maleImage} 
                className='w-[100%] lg:max-w-[180px] rounded-[30px]' alt="" onClick={()=>{setGender('male'), setPreview(true)}}/>

                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 1.5}} className='w-[100%] lg:max-w-[180px] Lora font-bold text-white mt-[10px] text-center'
                style={{fontSize: 'clamp(16px, 7vw,25px)'}}>Male</motion.div>

            </div>
            <div className='w-[40%] lg:w-auto h-auto flex flex-wrap justify-start'>
                
                <motion.img initial={{opacity: 0, x: '50%'}} animate={{opacity: 1, x: 0, transition:{delay: 0.7, duration: 0.7}}} whileTap={{scale: 0.8}} src={femaleImage} 
                className='w-[100%] lg:max-w-[180px] rounded-[30px]' alt="" onClick={()=>{setGender('female'), setPreview(true)}}/>

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
            <div className={`absolute portraitBox top-[50%] lg:top-[55%] left-[50%] lg:left-[30%] max-w-[720px] translate-x-[-50%] translate-y-[-50%] ${normalize?' rounded-[0px] w-[100vw]':'rounded-[30px] w-[90%] md:w-[400px]'}  bg-white`}
            style={{aspectRatio: '1/1.065', border: '2px solid white', boxShadow: '0px 0px 9px 0px rgba(255,255,255,0.75)', filter: normalize?'opacity(0)':'opacity(1)'}}>

                {/* LOADING SCREEN ////////////////////////////////////// */}
                <div className='w-[100%] h-[100%] rounded-[32px] absolute z-[10] bg-[#151515fa] justify-center items-center text-white'
                style={{display: loading?'flex':'none'}}>
                    Loading...
                </div>

                {/* SKIN LAYER ////////////////////////////////////////// */}
                <canvas width={wBox-5} height={hBox-5} id='skinCanvas' className={`absolute z-[1] ${normalize?'rounded-[0px]':'rounded-[32px]'}`}>

                </canvas>

                {/* AGE BRACKET LAYER ////////////////////////////////////////////// */}
                <img className={`w-[100%] h-[100%] ${normalize?'rounded-[0px]':'rounded-[32px]'} absolute z-[3]`} src={ageBracketSelection}
                style={{objectPositionPosition: 'center', objectFit: 'contain'}} />   
                <canvas width={wBox} height={hBox} id='clothesCanvas' className={`absolute z-[2] ${normalize?'rounded-[0px]':'rounded-[32px]'}`}>

                </canvas>

                {/* EYE LAYER /////////////////////////////////////////////////// */}
                <img className={`w-[100%] h-[100%] ${normalize?'rounded-[0px]':'rounded-[32px]'} absolute z-[4]`} src={eyeSelection} onLoad={()=>{setLoading(false)}}
                style={{objectPositionPosition: 'center', objectFit: 'contain'}} />
                
                {/* EXPRESSION LAYER /////////////////////////////////////// */}
                <img className={`w-[100%] h-[100%] ${normalize?'rounded-[0px]':'rounded-[32px]'} absolute z-[5]`} src={expSelection} onLoad={()=>{setLoading(false)}}
                style={{objectPositionPosition: 'center', objectFit: 'contain'}} />


                {/* HAIR LAYER ///////////////////////////////////////////// */}
                <canvas width={wBox} height={hBox} id='canvas' className={`absolute z-[6] ${normalize?'rounded-[0px]':'rounded-[32px]'}`}>

                </canvas>
                {hairSelection && (<img className={`w-[100%] h-[100%] ${normalize?'rounded-[0px]':'rounded-[32px]'} absolute z-[7]`} src={hairSelection}
                style={{objectPositionPosition: 'center', objectFit: 'contain'}} />)}

                
                

            </div>


            {/* AVAILABLE CHOICES */}
            <div className=' absolute w-[100%] m-auto px-[10px] md:w-[450px] flex flex-wrap lg:left-[50%] top-[82%] lg:top-[50%] translate-y-[0%] lg:translate-y-[-50%] max-h-[110px] overflow-scroll'>
                {choices.map((choice, i)=>{
                    return(
                        <motion.div whileTap={{scale: 0.9}} key={`${choice.name}${choice.level}`} initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: normalize?0:1, transition:{delay: i*0.1, opacity:{duration: 0.5, delay: normalize?0:i*0.1}}}}
                        className={`rounded-[20px] w-[70px] max-w-[70px] px-[10px] m-[5px] h-[40px] flex justify-center items-center bg-white ${choice.name.length>8?'textOverflowAnim':''} `} 
                        style={{cursor: 'pointer', backgroundColor: choice.img==ageBracketSelection||choice.img==skinSelection||choice.img==eyeSelection||choice.img==expSelection||choice.img==hairSelection||choice.img==hairColorSelection? '#ff74c5':'white',
                        color: choice.img==ageBracketSelection||choice.img==skinSelection||choice.img==eyeSelection||choice.img==expSelection||choice.img==hairSelection||choice.img==hairColorSelection? 'white':'black', transition: '0.2s', whiteSpace:'nowrap', overflow: 'hidden',
                        animationDelay: `${i/3}s`}}
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