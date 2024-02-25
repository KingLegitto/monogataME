import { useEffect, useState } from "react";
import { ZoomContext } from '../App.jsx'
import { useContext } from 'react'
import Protrait from "./characterProtrait.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import maleImage from '../assets/portraitImgs/gender/male.png'
import femaleImage from '../assets/portraitImgs/gender/female.png'
import Viewer from "./portraitViewer.jsx";
import { AddRounded } from "@mui/icons-material";
import { addCharacters } from "../redux/reduxStates.js";
import CharacterComp from "./characterComp.jsx";

const Characters = () => {

    const { workableArea, characters } = useSelector((state) => state.overallStates)
    const dispatch = useDispatch()

    const [portrait, setPortrait] = useState(false)
    const [bgOverlay, setBgOverlay] = useState(false)
    const [characterNum, setCharacterNum] = useState(0)
    const [viewer, setViewer] = useState(false)
    const [nameToSend, setNameToSend] = useState()
    const [targetImg, setTargetImg] = useState('')
    

    // const [characters, setCharacters] = useState([
    //     {name: 'Madara Uchiha', popularName: '', dob: '24th Dec', age: '', height: '179', weight: '71.3', portrait: ''},
    //     {name: 'Kurama', popularName: '9 tails fox', dob: '', age: '', height: '', weight: '', portrait: ''},
    //     {name: '', popularName: '', dob: '', age: '', height: '', weight: '', portrait: ''},
        
    // ])

    useEffect(()=>{
        if(portrait){
            document.querySelector('.menuIcon').style.opacity = '0.5'
        }else{
            document.querySelector('.menuIcon').style.opacity = '1'
        }
    }, [portrait])
    return ( 
        <>

        <AnimatePresence>
                {bgOverlay && (<motion.div exit={{opacity: 0, transition: {delay: 0.5, duration: 0.5}}} initial={{opacity: 0}} animate={{opacity: 0.6}} transition={{duration: 1, delay: 0.3}} 
                className='bg-black fixed w-screen h-screen z-[11]'>

        </motion.div>)}
        </AnimatePresence>


            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.7}} className="bg-[#0000007a] grid justify-center absolute z-[10] top-0 left-0 right-0 mx-auto pt-[20px] px-[20px]" 
            style={{height: workableArea.height, width: innerWidth<1000? '100vw': workableArea.width,
            gridTemplateRows: 'repeat(auto-fill,150px)', gridTemplateColumns: innerWidth>1000? '50% 50%':'100%', gap: '1rem'}}>
                {characters.map((item, i)=>{
                    return(
                        <CharacterComp key={`${item.name}+ ${i}`} keyId={i} setBgOverlay={setBgOverlay}
                        setViewer={setViewer} setNameToSend={setNameToSend} setTargetImg={setTargetImg} setCharacterNum={setCharacterNum}/>
                    ) 
                })}
                <motion.div whileTap={{scale: 0.9}} className="w-[100%] max-w-[480px] h-[100%] bg-[#00000063] flex justify-center  justify-self-center items-center rounded-[20px] border-[2px] border-[transparent] overflow-hidden"
                onClick={()=>{dispatch(addCharacters({name: '', popularName: '', dob: '', age: '', height: '', weight: '', portrait: ''}))}}>
                    <AddRounded style={{transform: 'scale(2)', color: 'white'}}/>
                </motion.div>
            </motion.div>

            {portrait && <Protrait setPortrait={setPortrait} characterNum={characterNum} setBgOverlay={setBgOverlay}/>}

            <AnimatePresence>
                {viewer && <Viewer viewer={viewer} targetImg={targetImg} setViewer={setViewer} setBgOverlay={setBgOverlay} setPortrait={setPortrait} nameToSend={nameToSend}/>}
            </AnimatePresence>
            
        </>
        
        
     );
}
 
export default Characters;