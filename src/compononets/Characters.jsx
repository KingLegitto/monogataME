import { useEffect, useState } from "react";
import { ZoomContext } from '../App.jsx'
import { useContext } from 'react'
import Protrait from "./characterProtrait.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import maleImage from '../assets/portraitImgs/gender/male.png'
import femaleImage from '../assets/portraitImgs/gender/female.png'
import placeholder from '../assets/portraitImgs/placeholder.png'
import Viewer from "./portraitViewer.jsx";

const Characters = () => {

    const { workableArea } = useSelector((state) => state.overallStates)

    const {setSelectionArea, selectionArea} = useContext(ZoomContext)
    const [portrait, setPortrait] = useState(false)
    const [bgOverlay, setBgOverlay] = useState(false)
    const [characterNum, setCharacterNum] = useState(0)
    const [viewer, setViewer] = useState(false)
    const [nameToSend, setNameToSend] = useState()
    const [targetImg, setTargetImg] = useState('')

    const [characters, setCharacters] = useState([
        {name: 'Madara Uchiha', popularName: '', dob: '24th Dec', age: '', height: '179', weight: '71.3', portrait: ''},
        {name: 'Kurama', popularName: '9 tails fox', dob: '', age: '', height: '', weight: '', portrait: ''},
        {name: '', popularName: '', dob: '', age: '', height: '', weight: '', portrait: ''},
        
    ])

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
                        <div key={i} className="w-[100%] max-w-[480px] h-[100%] bg-[#eeeeeee5] justify-items-center justify-self-center grid grid-cols-2 items-center rounded-[20px] border-[2px] border-[transparent] overflow-hidden">
                            <div className="h-[100%] w-[90%] bg-gray-500 justify-self-start rounded-l-[20px] "
                            style={{backgroundImage: `url(${item.portrait==''?placeholder:item.portrait})`, backgroundPosition: innerWidth<800?'center 40%':'center 40%', backgroundSize: innerWidth<800?'140%':'110%',
                            boxShadow: '3px 0px 10px 2px rgba(0,0,0,0.7)'}}
                            onClick={()=>{ setTargetImg(item.portrait==''?placeholder:item.portrait),setViewer(true), setBgOverlay(!bgOverlay), setCharacterNum(i), setNameToSend(item.name==''? 'unnamed_character':item.name)}}>
                                
                            </div>

                            <div className=" h-[75%] w-[100%] characterDetails flex-col flex justify-around p-[10px]">
                                <input type="text"  value={item.name==''? '---------------':item.name}/>
                                {item.popularName!='' && (<input type="text"  value={item.popularName}/>)}
                                <span >
                                    <input type="text"  value={item.dob==''?'---':item.dob}/>
                                    <input type="text" value={`${item.age==''?'---':item.age} yrs`}/>
                                </span>
                                
                                <span>
                                    <input type="text" value={`${item.height==''?'---':item.height} cm`}/>
                                    <input type="text" value={`${item.weight==''?'---':item.weight} kg`}/>
                                </span>
                                
                            </div>
                        </div>
                    ) 
                })}
            </motion.div>

            {portrait && <Protrait setPortrait={setPortrait} characterNum={characterNum} characters={characters} setBgOverlay={setBgOverlay}/>}

            <AnimatePresence>
                {viewer && <Viewer viewer={viewer} targetImg={targetImg} setViewer={setViewer} setBgOverlay={setBgOverlay} setPortrait={setPortrait} nameToSend={nameToSend}/>}
            </AnimatePresence>
            
        </>
        
        
     );
}
 
export default Characters;