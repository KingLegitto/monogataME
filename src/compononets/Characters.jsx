import { useEffect, useState } from "react";
import { ZoomContext } from '../App.jsx'
import { useContext } from 'react'
import Protrait from "./characterProtrait.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import maleImage from '../assets/portraitImgs/gender/male.png'
import femaleImage from '../assets/portraitImgs/gender/female.png'

const Characters = () => {

    const { workableArea } = useSelector((state) => state.overallStates)

    const {setSelectionArea, selectionArea} = useContext(ZoomContext)
    const [portrait, setPortrait] = useState(false)
    const [bgOverlay, setBgOverlay] = useState(false)

    const [characters, setCharacters] = useState([
        {name: 'Madara Uchiha', popularName: '', dob: '24th Dec', age: '', height: '179', weight: '71.3', portrait: maleImage},
        {name: 'Kurama', popularName: '9 tails fox', dob: '', age: '', height: '', weight: '', portrait: femaleImage},
        {name: '', popularName: '', dob: '', age: '', height: '', weight: '',},
        {name: '', popularName: '', dob: '', age: '', height: '', weight: '',},
        {name: '', popularName: '', dob: '', age: '', height: '', weight: '',},
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
            gridTemplateRows: 'repeat(auto-fill,200px)', gridTemplateColumns: innerWidth>1000? '50% 50%':'100%', gap: '1rem'}}>
                {characters.map((item)=>{
                    return(
                        <div className="w-[100%] h-[100%] bg-[#eeeeeee5] justify-items-center grid grid-cols-2 items-center rounded-[20px] p-[10px]">
                            <div className="h-[75%] lg:h-[80%] rounded-[50%] aspect-square bg-gray-500"
                            style={{backgroundImage: `url(${item.portrait})`, backgroundPosition: 'center top', backgroundSize: '120%'}}
                            onClick={()=>{setPortrait(!portrait), setBgOverlay(!bgOverlay)}}>
                                
                            </div>
                            <div className=" h-[75%] w-[100%] characterDetails flex-col flex justify-around">
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

            {portrait && <Protrait />}
        </>
        
        
     );
}
 
export default Characters;