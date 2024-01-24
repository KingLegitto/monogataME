import { useState } from "react";
import { ZoomContext } from '../App.jsx'
import { useContext } from 'react'
import Protrait from "./characterProtrait.jsx";
import { motion, AnimatePresence } from "framer-motion";

const Characters = () => {
    const {setSelectionArea, selectionArea, workableArea, slider} = useContext(ZoomContext)
    const [portrait, setPortrait] = useState(false)
    const [bgOverlay, setBgOverlay] = useState(false)

    const [characters, setCharacters] = useState([
        {name: '', popularName: '', height: '', weight: '', portrait: ''},
        {},
        {},
        {},
        {},
    ])
    return ( 
        <>

        <AnimatePresence>
                {bgOverlay && (<motion.div exit={{opacity: 0, transition: {delay: 0.5, duration: 0.5}}} initial={{opacity: 0}} animate={{opacity: 0.6}} transition={{duration: 1, delay: 0.3}} className='bg-black fixed w-screen h-screen z-[11]'>

        </motion.div>)}
        </AnimatePresence>


            <div className=" grid justify-center absolute z-[10] top-0 left-0 right-0 mx-auto pt-[20px] px-[20px]" 
            style={{height: workableArea.height, width: innerWidth<1000? '100vw': workableArea.width, 
            gridTemplateRows: 'repeat(auto-fill,200px)', gridTemplateColumns: innerWidth>1000? '50% 50%':'100%', gap: '1rem'}}>
                {characters.map((item)=>{
                    return(
                        <div className="w-[100%] h-[100%] bg-[#eeeeeee5] justify-items-center grid grid-cols-2 items-center rounded-[20px] p-[10px]">
                            <div className="h-[75%] lg:h-[80%] rounded-[50%] aspect-square bg-gray-500"
                            onClick={()=>{setPortrait(!portrait), setBgOverlay(!bgOverlay)}}>

                            </div>
                            <div className=" h-[75%] w-[100%] characterDetails flex-col flex justify-around">
                                <input type="text" placeholder="Name" />
                                <input type="text" placeholder="Popular name" />
                                <span >
                                    <input type="text" placeholder="D.O.B." />
                                    <input type="number" placeholder="Age"/>
                                </span>
                                
                                <span>
                                    <input type="text" placeholder="Weight (kg)"/>
                                    <input type="text" placeholder="Height (cm)"/>
                                </span>
                                
                            </div>
                        </div>
                    ) 
                })}
            </div>

            {portrait && <Protrait />}
        </>
        
        
     );
}
 
export default Characters;