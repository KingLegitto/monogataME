import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { useSelector, useDispatch } from "react-redux";
import { placeImage } from '../redux/reduxStates.js';
import {
    maleImage, femaleImage, babyBase, babyBaseC, babyBaseSH, teenMBase, teenMBaseC, teenMBaseSH, adultFBase, adultFBaseC,
    eye1, eye2, eye3, eye4, dullEyes, skin1, skin2, skin3, exp, babyExp, confidentExp, grinExp, determinedExp,
    indiffExp, seriousExp, annoyed, spikyHairL, spikyHairC, flatishTopL, flatishTopC, longBangsL, longBangsC,
    afroL, afroC, circleGlasses, earrings1, earrings2, policeShades, geekyGlasses
} from './portraitImports.js'

const Protrait = ({setPortrait, characterNum, setBgOverlay}) => {
    const { characters } = useSelector((state) => state.overallStates)
    const dispatch = useDispatch()

    const [preview, setPreview] = useState(false)
    const [gender, setGender] = useState('')
    const [loading, setLoading] = useState(true)
    const [hBox, setHBox] = useState()
    const [wBox, setWBox] = useState()
    const [skinSelection, setSkinSelection] = useState(skin2)
    const [ageBracketSelection, setAgeBracketSelection] = useState([babyBase,babyBaseC])
    const [eyeSelection, setEyeSelection] = useState(gender=='male'?eye1:eye2)
    const [expSelection, setExpSelection] = useState(ageBracketSelection==babyBase?babyExp:exp)
    const [hairSelection, setHairSelection] = useState([])
    // const [hairColorSelection, setHairColorSelection] = useState([19,37,45])
    const [clothesCurrentC, setClothesCurrentC] = useState([255,101,163])
    const [clothesNewC, setClothesNewC] = useState([255,101,163])
    const [hairCurrentC, setHairCurrentC] = useState([19,37,45])
    const [hairNewC, setHairNewC] = useState([19,37,45])
    const [accessorySelection, setAccessorySelection] = useState()
    const [normalize, setNormalize] = useState(false)
    const [allClear, setAllClear] = useState(false)

    // CHOICES ///////////////////////////////////////////////////////////////
    const [ageBracketChoices, setAgeBracketChoices] = useState([
        {name: 'Baby', img: [babyBase,babyBaseC], level: 1},
        {name: 'Teen', img: [teenMBase,teenMBaseC], level: 1},
        {name: 'Next', img: 'next', level: 1},
    ])
    const [ageBracketChoicesF, setAgeBracketChoicesF] = useState([
        {name: 'Baby', img: [babyBase,babyBaseC], level: 1},
        {name: 'Adult', img: [adultFBase,adultFBaseC], level: 1},
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
        {name: 'Dull', img: dullEyes, level: 3},
        {name: 'Next', img: 'next', level: 3},
    ])
    const [expressChoices, setExpressChoices] = useState([
        {name: 'Go back', img: 'back', level: 4},
        {name: 'Smile', img: exp, level: 4},
        {name: 'Grin', img: grinExp, level: 4},
        {name: 'Determined', img: determinedExp, level: 4},
        // {name: 'Confident', img: confidentExp, level: 4},
        // {name: 'Serious', img: seriousExp, level: 4},
        {name: 'Indifferent', img: indiffExp, level: 4},
        {name: 'Annoyed', img: annoyed, level: 4},
        {name: 'Next', img: 'next', level: 4},
    ])
    const [expressChoicesBaby, setExpressChoicesBaby] = useState([
        {name: 'Go back', img: 'back', level: 4},
        {name: 'Smile', img: babyExp, level: 4},
        {name: 'Next', img: 'next', level: 4},
    ])
    const [clothesColors, setClothesColors] = useState([
        {name: 'Go back', img: 'back', level: 4.5},
        {name: 'Purple', img: [255,101,163], level: 4.5},
        {name: 'Black', img: [19,37,45], level: 4.5},
        {name: 'Red', img: [204,59,59], level: 4.5},
        {name: 'White', img: [230,230,230], level: 4.5},
        {name: 'Next', img: 'next', level: 4.5},
    ])
    const [hairChoices, setHairChoices] = useState([
        {name: 'Go back', img: 'back', level: 5},
        {name: 'Bald', img: [null,null], level: 5},
        {name: 'Spiky', img: [spikyHairL,spikyHairC], level: 5},
        {name: 'Afro', img: [afroL, afroC], level: 5, check: 'notForBaby'},
        {name: 'Flatish Top', img: [flatishTopL,flatishTopC], level: 5},
        {name: 'Next', img: 'next', level: 5},
    ])
    const [hairChoicesF, setHairChoicesF] = useState([
        {name: 'Go back', img: 'back', level: 5},
        {name: 'Bald', img: [null, null], level: 5},
        {name: 'Spiky', img: [spikyHairL,spikyHairC], level: 5},
        {name: 'Long(Bangs)', img: [longBangsL,longBangsC], level: 5, check: 'notForBaby'},
        {name: 'Afro', img: [afroL, afroC], level: 5, check: 'notForBaby'},
        {name: 'Next', img: 'next', level: 5},
    ])
    const [hairColors, setHairColors] = useState([
        {name: 'Go back', img: 'backToHair', level: 5},
        {name: 'Black', img: [19,37,45], level: 5},
        {name: 'White', img: [191,191,191], level: 5},
        {name: 'Blonde', img: [255,232,140], level: 5 },
        {name: 'Green', img: [175,255,155], level: 5 },
        {name: 'Red', img: [204,40, 40], level: 5 },
        {name: 'Pink', img: [255,101,163], level: 5 },
        {name: 'Blue', img: [110,177,204], level: 5 },
        {name: 'Brown', img: [114,77,57], level: 5},
        {name: 'Next', img: 'next', level: 5},
    ])
    const [accessories, setAccessories] = useState([
        {name: 'Go back', img: 'back', level: 6},
        {name: 'None', img: null, level: 6},
        {name: 'Geeky Glasses', img: geekyGlasses, level: 6},
        {name: 'Circle Glasses', img: circleGlasses, level: 6},
        {name: 'Police Shades', img: policeShades, level: 6},
        {name: 'Earring(S)', img: earrings1, level: 6},
        {name: 'Earrings(B)', img: earrings2, level: 6},
        {name: 'Finish', img: 'Finish', level: 6},
    ])

    const [choices, setChoices] = useState(ageBracketChoices)
    useEffect(()=>{
        if(preview){
            setChoices(gender=='male'?ageBracketChoices:ageBracketChoicesF)
        }
    }, [gender])

    const [levels, setLevels] = useState([
        {name: 'Gender'}, 
        {name: 'Body'}, 
        {name: 'Skin'}, 
        {name: 'Eyes'}, 
        {name: 'Expressions'},
        {name: 'Hair'}, 
        {name: 'Accessories'}
    ])

    function changeLevel(name){
        switch(name){
            case 'Gender':
                setAgeBracketSelection([babyBase,babyBaseC]), setSkinSelection(skin2), setEyeSelection(eye1), setHairSelection([,]), setAccessorySelection()
                ,setPreview(false)
                break;
            case 'Body':
                setChoices(gender=='male'?ageBracketChoices:ageBracketChoicesF)
                break;
            case 'Skin':
                setChoices(skinChoices)
                break;
            case 'Eyes':
                setChoices(eyeChoices)
                break;
            case 'Expressions':
                setChoices(ageBracketSelection[0]==babyBase?expressChoicesBaby:expressChoices)
                break;
            case 'Hair':
                setChoices(gender=='male'?hairChoices:hairChoicesF)
                break;
            case 'Accessories':
                setChoices(accessories)
        }
    }
    
    // LOGIC TO REMOVE AVAILABLE CHOICES THAT SHOULD NOT BE AVAILABLE
    useEffect(()=>{
        if(preview){
            choices.forEach((option)=>{
                if(option.check){
                    switch(option.check){
                        case 'notForBaby':
                            if(ageBracketSelection[0]==babyBase){
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
                    if(ageBracketSelection[0] != img){
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
                    setChoices(ageBracketSelection[0]==babyBase?expressChoicesBaby:expressChoices)
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
                    setChoices(ageBracketSelection[0]==babyBase?expressChoicesBaby:expressChoices)
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
                    setChoices(choices==hairColors?accessories:hairColors)
                }
                
                else{
                    if(hairSelection != img && img != null && choices != hairColors){
                        setLoading(true)
                    }
                    
                    choices==hairColors?setHairCurrentC(hairNewC):setHairSelection(img)
                    choices==hairColors?setHairNewC(img):''
                } 
                break
            }
            case 6:{
                if(img == 'back'){
                    setChoices(hairColors)
                
                }
                else if(img == 'Finish'){
                    setNormalize(true)
                    
                }
                else{
                    if(accessorySelection != img && img != null){
                        setLoading(true)
                    }
                    
                    setAccessorySelection(img)
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
        setExpSelection(ageBracketSelection[0]==babyBase?babyExp:exp)
    }, [ageBracketSelection])

    useEffect(()=>{
        if(preview){
            const hairImg = new Image()

        hairImg.src = hairSelection[1]

        const clothes = new Image()
        clothes.src = ageBracketSelection[1]

        const skinImg = new Image()
        const skinH = new Image()
        skinImg.src = skinSelection
        skinH.src = ageBracketSelection[0]==babyBase?babyBaseSH:
                    ageBracketSelection[0]==teenMBase||ageBracketSelection[0]==adultFBase?teenMBaseSH:''

        const accessImg = new Image()
        accessImg.src = accessorySelection
    
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
                data[i] = data[i]!=hairCurrentC[0]?hairNewC[0] + redHair(data[i]):hairNewC[0];
                data[i+1] = data[i+1]!=hairCurrentC[1]?hairNewC[1] + greenHair(data[i+1]):hairNewC[1];
                data[i+2] = data[i+2]!=hairCurrentC[2]?hairNewC[2] + blueHair(data[i+2]):hairNewC[2];
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
                data[i] = data[i]!=clothesCurrentC[0]?clothesNewC[0] + redClothes(data[i]):clothesNewC[0];
                data[i+1] = data[i+1]!=clothesCurrentC[1]?clothesNewC[1] + greenClothes(data[i+1]):clothesNewC[1];
                data[i+2] = data[i+2]!=clothesCurrentC[2]?clothesNewC[2] + blueClothes(data[i+2]):clothesNewC[2];
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

        const canvas4 = document.getElementById('accessCanvas')
        const ctxAccess = canvas4.getContext('2d')

        ctxAccess.clearRect(0,0,wBox,hBox)
        accessImg.onload = ()=>{
            ctxAccess.drawImage(accessImg,0,0, 720, 767, -2, -3, wBox, hBox)
            setLoading(false)
            
            // const imageData = ctxAccess.getImageData(0, 0, canvas.width, canvas.height)
            // const data = imageData.data
    
            // for (let i = 0; i < data.length; i += 4){
            //     data[i] = data[i]!=clothesCurrentC[0]?clothesNewC[0] + redClothes(data[i]):clothesNewC[0];
            //     data[i+1] = data[i+1]!=clothesCurrentC[1]?clothesNewC[1] + greenClothes(data[i+1]):clothesNewC[1];
            //     data[i+2] = data[i+2]!=clothesCurrentC[2]?clothesNewC[2] + blueClothes(data[i+2]):clothesNewC[2];
            // }
            // ctxAccess.putImageData(imageData, 0, 0)
        }

        }
    }, [preview, hairSelection, ageBracketSelection, skinSelection, hairNewC, wBox, clothesNewC, accessorySelection])

    function redClothes(val){
        let diff = val - 255
        return diff
    }
    function greenClothes(val){
        let diff = val - 101
        return diff
    }
    function blueClothes(val){
        let diff = val - 163
        return diff
    }

    function redHair(val){
        let diff = val - 19
        return diff
    }
    function greenHair(val){
        let diff = val - 37
        return diff
    }
    function blueHair(val){
        let diff = val - 45
        return diff
    }

    useEffect(()=>{
        if(preview){
            let h = document.querySelector('.portraitBox').getBoundingClientRect().height

            let w = document.querySelector('.portraitBox').getBoundingClientRect().width

            setHBox(h)
            setWBox(w)

        
        }
       
    }, [preview, normalize, hairSelection, ageBracketSelection, skinSelection, 
    accessorySelection, eyeSelection, expSelection])

    return ( 

        <>
        {/* GENDER ///////////////////////////////// */}
        {!preview && (<div className="h-auto w-[100%] lg:w-[50%] fixed z-[12] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] lg:translate-y-[-45%] flex justify-around">
            <div className='w-[40%] lg:w-auto h-auto flex flex-wrap justify-end' onClick={()=>{setGender('male'), setPreview(true)}}>
                
                <motion.img initial={{opacity: 0, x: '-50%'}} animate={{opacity: 1, x: 0, transition:{delay: 0.7, duration: 0.7}}} whileTap={{scale: 0.8}} src={maleImage} 
                className='w-[100%] lg:max-w-[180px] rounded-[30px]' alt=""/>

                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 1.5}} className='w-[100%] lg:max-w-[180px] Lora font-bold text-white mt-[10px] text-center'
                style={{fontSize: 'clamp(16px, 7vw,25px)'}}>Male</motion.div>

            </div>
            <div className='w-[40%] lg:w-auto h-auto flex flex-wrap justify-start' onClick={()=>{setGender('female'), setPreview(true)}}>
                
                <motion.img initial={{opacity: 0, x: '50%'}} animate={{opacity: 1, x: 0, transition:{delay: 0.7, duration: 0.7}}} whileTap={{scale: 0.8}} src={femaleImage} 
                className='w-[100%] lg:max-w-[180px] rounded-[30px]' alt=""/>

                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 1.5}} className='w-[100%] lg:max-w-[180px] Lora font-bold text-white mt-[10px] text-center'
                style={{fontSize: 'clamp(16px, 7vw,25px)'}}>Female</motion.div>

            </div>
            
            
        </div>)}

        {/* PORTRAIT PARENT ///////////////////////////////////// */}
        {preview && (<div className='w-[100%] fixed z-[12] bottom-[50%] translate-y-[50%] h-[85dvh] lg:h-[100vh]
        grid grid-cols-1 lg:grid-cols-2'>


            {/* PORTRAIT DISPLAY //////////////////////////////////////////// */}
            <div className={` portraitBox max-w-[720px] ${normalize?' rounded-[0px] w-[100vw]':'rounded-[30px] w-[90%] md:w-[400px]'}  bg-white 
            row-span-2 self-center justify-self-center order-1 lg:order-[0] `}
            style={{aspectRatio: '1/1.065', border: '2px solid white', boxShadow: '0px 0px 9px 0px rgba(255,255,255,0.75)', filter: normalize?'opacity(0)':'opacity(1)'}}>

                {/* LOADING OVERLAY ////////////////////////////////////// */}
                <div className='w-[100%] h-[100%] rounded-[32px] absolute z-[10] bg-[#151515fa] justify-center items-center text-white'
                style={{display: loading?'flex':'none'}}>
                    Loading...
                </div>

                {/* SKIN LAYER ////////////////////////////////////////// */}
                <canvas width={wBox-5} height={hBox-5} id='skinCanvas' className={`absolute z-[1] ${normalize?'rounded-[0px]':'rounded-[32px]'}`}>

                </canvas>

                {/* AGE BRACKET LAYER ////////////////////////////////////////////// */}   
                <canvas width={wBox} height={hBox} id='clothesCanvas' className={`absolute z-[2] ${normalize?'rounded-[0px]':'rounded-[32px]'}`}>

                </canvas>
                <img className={`w-[100%] h-[100%] ${normalize?'rounded-[0px]':'rounded-[32px]'} absolute z-[3]`} src={ageBracketSelection[0]}
                style={{objectPositionPosition: 'center', objectFit: 'contain'}} />

                {/* EYE LAYER /////////////////////////////////////////////////// */}
                <img className={`w-[100%] h-[100%] ${normalize?'rounded-[0px]':'rounded-[32px]'} absolute z-[4]`} src={eyeSelection} onLoad={()=>{setLoading(false)}}
                style={{objectPositionPosition: 'center', objectFit: 'contain'}} />
                
                {/* EXPRESSION LAYER /////////////////////////////////////// */}
                <img className={`w-[100%] h-[100%] ${normalize?'rounded-[0px]':'rounded-[32px]'} absolute z-[5]`} src={expSelection} onLoad={()=>{setLoading(false)}}
                style={{objectPositionPosition: 'center', objectFit: 'contain'}} />


                {/* HAIR LAYER ///////////////////////////////////////////// */}
                <canvas width={wBox} height={hBox} id='canvas' className={`absolute z-[6] ${normalize?'rounded-[0px]':'rounded-[32px]'}`}>

                </canvas>
                {hairSelection[0] && (<img className={`w-[100%] h-[100%] ${normalize?'rounded-[0px]':'rounded-[32px]'} absolute z-[7]`} src={hairSelection[0]}
                style={{objectPositionPosition: 'center', objectFit: 'contain'}} />)}

                {/* ACCESSORIES LAYER ////////////////////////////////////////// */}
                <canvas width={wBox} height={hBox} id='accessCanvas' className={`absolute z-[8] ${normalize?'rounded-[0px]':'rounded-[32px]'}`}>

                </canvas>

            </div>

            {/* LEVELS ////////////////////////////////////////////////////// */}
            <div className="w-[100%] md:w-[450px] h-[auto] flex overflow-scroll self-end lg:self-center px-[10px] ">
                {levels.map((level, i)=>{
                    return(
                        <motion.div whileTap={{scale: 0.9}} key={`${level.name}`} initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: normalize?0:1, transition:{delay: i*0.1, opacity:{duration: 0.5, delay: normalize?0:i*0.1}}}}
                        className={`rounded-[20px] w-[70px] max-w-[70px] px-[10px] m-[5px] h-[40px] flex justify-center flex-shrink-0 items-center bg-white ${level.name.length>8?'textOverflowAnim':''} `} 
                        style={{cursor: 'pointer', transition: '0.2s', whiteSpace:'nowrap', overflow: 'hidden',
                        backgroundColor: 
                        (
                            level.name=='Eyes' && choices==eyeChoices)||(level.name=='Body' && (choices==ageBracketChoicesF||choices==ageBracketChoices)
                            ||(level.name=='Skin' && choices==skinChoices)||(level.name=='Expressions' && (choices==expressChoices||choices==expressChoicesBaby))
                            ||(level.name=='Hair' && (choices==hairChoices||choices==hairChoicesF))||(level.name=='Accessories' && choices==accessories)
                        )
                        ?'#ff74c5':'white',
                        color: 
                        (
                            level.name=='Eyes' && choices==eyeChoices)||(level.name=='Body' && (choices==ageBracketChoicesF||choices==ageBracketChoices)
                            ||(level.name=='Skin' && choices==skinChoices)||(level.name=='Expressions' && (choices==expressChoices||choices==expressChoicesBaby))
                            ||(level.name=='Hair' && (choices==hairChoices||choices==hairChoicesF))||(level.name=='Accessories' && choices==accessories)
                        )
                        ?'white':'black',
                        animationDelay: `${i/3}s`}}
                        onClick={()=>{changeLevel(level.name)}}>
                            {level.name}
                        </motion.div>
                    )
                })}
            </div>


            {/* AVAILABLE CHOICES //////////////////////////////////////////////////////*/}
            <div className=' w-[100%] md:w-[450px] px-[10px] flex flex-wrap h-[80px] lg:h-[100px] overflow-scroll order-2 lg:order-[0]'>
                {choices.map((choice, i)=>{
                    return(
                        <motion.div whileTap={{scale: 0.9}} key={`${choice.name}${choice.level}`} initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: normalize?0:1, transition:{delay: i*0.1, opacity:{duration: 0.5, delay: normalize?0:i*0.1}}}}
                        className={`rounded-[20px] w-[70px] max-w-[70px] px-[10px] m-[5px] h-[40px] flex justify-center items-center bg-white ${choice.name.length>8?'textOverflowAnim':''} `} 
                        style={{cursor: 'pointer', backgroundColor: choice.img==ageBracketSelection||choice.img==skinSelection||choice.img==eyeSelection||choice.img==expSelection||choice.img==hairSelection||choice.img==hairNewC? '#ff74c5':'white',
                        color: choice.img==ageBracketSelection||choice.img==skinSelection||choice.img==eyeSelection||choice.img==expSelection||choice.img==hairSelection||choice.img==hairNewC? 'white':'black', transition: '0.2s', whiteSpace:'nowrap', overflow: 'hidden',
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