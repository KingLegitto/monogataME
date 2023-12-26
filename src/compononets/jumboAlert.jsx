const JumboAlert = () => {
    return ( 
        <div className="w-[95%] aspect-square fixed z-[100] left-[50%] top-[50%] text-center bg-white
        translate-x-[-50%] translate-y-[-50%] rounded-[20px] flex justify-center items-center"
        style={{boxShadow: '0px 10px 33px -7px rgba(0,0,0,0.75)'}}>
            Hey there, seems like your device is in potrait orientation.<br/>
            Rotate the device sideways to use the app.
        </div>
     );
}
 
export default JumboAlert;