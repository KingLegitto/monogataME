import { useState, useEffect } from "react"
import { sanityClient } from '../../client'
import { motion } from "framer-motion"

const Commands = ({setTracking, track, setMidPoint, setPoints, savePoints}) => {
    const [userDetails, setUserDetails] = useState(false)
    const [checkUserEmail, setCheckUserEmail] = useState(false)
    const [updater, setUpdater] = useState(true)

    const handleNewPoint = ()=>{
        document.querySelector('.bg').style.cursor = 'crosshair'
        document.querySelector('.bg').addEventListener('click', track)
        setTracking(true)
    }

    const handleNewSection = ()=>{
        document.querySelector('.bg').style.cursor = 'crosshair'
        let valueL = document.querySelector('.bg').getBoundingClientRect().left
        let valueR = document.querySelector('.bg').getBoundingClientRect().right
        let value = ((valueR - valueL)/2) + valueL
        // alert(value)
        setMidPoint(value)
        document.querySelector('.bg').addEventListener('click', track)
        setTracking(true)
    }

    const handleLogin = ()=>{
        var email = prompt('Type in your email')
        setCheckUserEmail(true)
        // alert(email)
        sanityClient.fetch(`*[_type == "users" && email == "${email}"]`)
        .then((data)=> {setUserDetails(data)})
    }

    const handleZoom = (value)=>{
    let elements = document.querySelectorAll('.zoom')
        elements.forEach((item)=>{
            item.style.transform = `scale(${value*2}%)`
        })

        let el = document.querySelector('.bgImage')
        switch(value){
            case '50': el.style.borderRadius='0px'; break;
            default: el.style.borderRadius='30px'
        }
        document.querySelector('.pointsParent').style.transform = `scale(${value*2}%)`
        
    
    }

    useEffect(()=>{
        // alert(userDetails)
            // alert(userDetails[0].username)
            if(userDetails == '' && checkUserEmail == true){
                alert('Could not find user. Check if you got the email right.')
                setCheckUserEmail(false)
            }
            if(userDetails != '' && checkUserEmail == true){
                let user = userDetails[0].username
                alert(`Great! Logged in as ${user}`)
                sanityClient.fetch(`*[_type == "plotPoints" && users == "${user}"]`).then((data)=> {setPoints(data)})
            }
            
        
      }, [userDetails])

    return ( 
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.3, delay: 0.3}} className="h-auto w-screen">
            <header className="w-[100vw] h-[50px] lg:h-[70px] grid bg-white fixed top-0 z-[90] justify-between items-center" 
            style={{gridTemplateColumns: '1fr 5fr 1fr'}}>
                <div className="w-[12vw] text-center justify-self-center">
                    
                    {!checkUserEmail && (<button onClick={handleLogin} className="bg-[#fb4ffb] px-[10px] py-[5px] rounded-[12px] ">
                        Log in
                    </button>)}
                    
                    {userDetails[0] && (userDetails[0].username)}
                </div>
                <h1 className="text-center text-[25px]">
                    MonogataME
                </h1>
                <div className="w-[12vw] text-center justify-self-center">
                    <button onClick={savePoints} className="bg-[#fb4ffb] px-[10px] py-[5px] rounded-[12px] ">Save</button>
                </div>
                
            </header>

            <aside className="w-[100px] lg:w-[200px] h-[100vh] fixed left-0 pt-[50px] lg:pt-[70px] pb-[8vh] z-[45] flex flex-col justify-center">
                <motion.button whileTap={{scale: 0.8}} className="w-[95%] lg:hover:scale-[1.05] mb-[5vh]">
                    Characters
                </motion.button>
                <motion.button whileTap={{scale: 0.8}} className="w-[95%] lg:hover:scale-[1.05] mb-[5vh]">
                    Progressions
                </motion.button>
                <motion.button whileTap={{scale: 0.8}} className="w-[95%] lg:hover:scale-[1.05] mb-[5vh]">
                    Lists
                </motion.button>
                <motion.button whileTap={{scale: 0.8}} className="w-[95%] leading-[1] lg:hover:scale-[1.05] mb-[5vh]" onClick={handleNewPoint}>
                    Add new point
                </motion.button>
                <motion.button whileTap={{scale: 0.8}} className="w-[95%] leading-[1] lg:hover:scale-[1.05] " onClick={handleNewSection}>
                    Add section point
                </motion.button>
            </aside>

            <div className="fixed w-[100vw] h-[2px] bg-white z-[50] bottom-0">
            <input type="range" min={innerHeight<500? 15: 25} max={50} step={5} onInput={(e)=>{handleZoom(e.target.value)}}
            className="absolute z-[51] top-[-20px] right-[50px]"/>
            </div>
            
            
        </motion.div>
     );
}
 
export default Commands;