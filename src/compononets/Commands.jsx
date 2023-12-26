import { useState, useEffect } from "react"
import { sanityClient } from '../../client'

const Commands = ({setTracking, track, setMidPoint, setPoints, savePoints}) => {
    const [userDetails, setUserDetails] = useState(false)
    const [checkUserEmail, setCheckUserEmail] = useState(false)

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
        <>
            <header className="w-[100vw] h-[12vh] bg-white fixed top-0 z-[50] flex justify-between items-center">
                <div className="w-[12vw] text-center">
                    
                    {!checkUserEmail && (<button onClick={handleLogin} className="bg-[#fb4ffb] px-[10px] py-[5px] rounded-[12px] ">
                        Log in
                    </button>)}
                    
    {userDetails[0] && (userDetails[0].username)}
                </div>
                <div className=" flex-grow text-center">
                    MONOGATAME
                </div>
                <div className="w-[12vw] absolute right-0 text-center">
                    <button onClick={savePoints} className="bg-[#fb4ffb] px-[10px] py-[5px] rounded-[12px] ">Save changes!</button>
                </div>
                
            </header>

            <aside className="w-[12vw] h-[100vh] bg-[#e7e7e7] fixed left-0 pt-[12vh] z-[45] flex flex-col justify-center items-center">
                <button className="w-[95%] mb-[10px] rounded-[10px] bg-red-400">
                    Characters
                </button>
                <button className="w-[95%] mb-[10px] rounded-[10px] bg-red-400">
                    Progressions
                </button>
                <button className="w-[95%] mb-[10px] rounded-[10px] bg-red-400">
                    Lists
                </button>
                <button className="w-[95%] mb-[10px] rounded-[10px] bg-red-400" onClick={handleNewPoint}>
                    Add new point
                </button>
                <button className="w-[95%] rounded-[10px] bg-red-400" onClick={handleNewSection}>
                    Add section point
                </button>
            </aside>
        </>
     );
}
 
export default Commands;