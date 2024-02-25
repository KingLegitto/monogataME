import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import placeholder from '../assets/portraitImgs/placeholder.png'
import { useSelector, useDispatch } from "react-redux";
import { Delete, Edit } from "@mui/icons-material";
import { deleteCharacters } from "../redux/reduxStates";

const CharacterComp = ({setBgOverlay, setViewer, setNameToSend, setTargetImg, setCharacterNum, keyId}) => {
    const character = useRef(null)
    const dispatch = useDispatch()
    const { workableArea, characters } = useSelector((state) => state.overallStates)
    const [editMode, setEditMode] = useState(false)

    useEffect(()=>{
        // ADDS EVENT LISTENER IF EDIT MODE ON A POINT IS ACTIVATED
        if(editMode){
            window.addEventListener('click', closeEditModeChar)
        }
    }, [editMode])

    // FUNCTION TO CATCH IF EDIT MODE IS ACTIVE ON A POINT AND USER CLICKS OUTSIDE SAID POINT
    const closeEditModeChar = useCallback((e)=>{
        let left = character.current.getBoundingClientRect().left
        let right = character.current.getBoundingClientRect().right
        let top = character.current.getBoundingClientRect().top
        let bottom = character.current.getBoundingClientRect().bottom
        
        // DEACTIVATES EDIT MODE FOR POINT IF USER CLICKS AWAY
        if(!((e.pageX >= left && e.pageX <= right) && (e.pageY >= top && e.pageY <= bottom))){
            setEditMode(false)
            // alert('eureka!!!')
            window.removeEventListener('click', closeEditModeChar)
        
        }
        
        
    }, [])
    return ( 
    <motion.div onTap={()=>{setEditMode(true)}} ref={character} key={keyId} initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 1}} className="w-[100%] max-w-[480px] h-[100%] relative bg-[#eeeeeee5] justify-items-center justify-self-center grid grid-cols-2 items-center rounded-[20px] border-[1px] border-[transparent] overflow-hidden"
     style={{outline: editMode?'3px solid #eeeeeee5':'2px solid transparent'}}>
        
        <div className="h-[100%] w-[90%] bg-gray-500 justify-self-start rounded-l-[20px] "
        style={{backgroundImage: `url(${characters[keyId].portrait==''?placeholder:characters[keyId].portrait})`, backgroundPosition: innerWidth<800?'center 40%':'center 40%', backgroundSize: innerWidth<800?'140%':'110%',
        boxShadow: '3px 0px 0px 3px rgba(0,0,0,0.7)'}}
        onClick={()=>{ setTargetImg(characters[keyId].portrait==''?placeholder:characters[keyId].portrait),setViewer(true), setBgOverlay(true), setCharacterNum(keyId), setNameToSend(characters[keyId].name==''? 'unnamed_character':characters[keyId].name)}}>
            
        </div>

        <div className=" h-[75%] w-[100%] relative characterDetails flex-col flex justify-around p-[10px]">
            {!editMode &&(<div className="h-[100%] w-[100%] opacity-[0] absolute">

            </div>)}
            <input type="text"   value={characters[keyId].name==''? '---------------':characters[keyId].name}/>
            {characters[keyId].popularName!='' && (<input type="text"  value={characters[keyId].popularName}/>)}
            <span >
                <input type="text"   value={characters[keyId].dob==''?'---':characters[keyId].dob}/>
                <input type="text"  value={`${characters[keyId].age==''?'---':characters[keyId].age} yrs`}/>
            </span>
            
            <span>
                <input type="text"  value={`${characters[keyId].height==''?'---':characters[keyId].height} cm`}/>
                <input type="text"  value={`${characters[keyId].weight==''?'---':characters[keyId].weight} kg`}/>
            </span>

            {editMode && (<div className=" absolute top-[-20px] right-0 w-[auto] h-[35px] p-[10px] bg-red-500 text-[white] rounded-[5px] flex justify-center items-center" onClick={()=>{dispatch(deleteCharacters(characters[keyId].name)), window.removeEventListener('click', closeEditModeChar)}}>
                < Delete />
            </div>)}
            
        </div>
</motion.div> );
}
 
export default CharacterComp;