import { ArrowBackIosNewOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useLocation, useNavigate } from "react-router";



export default function Backbutton(){ 
    
    const navigate = useNavigate();//for back button to easily navigate, -1 mean go back 1 page
    const location = useLocation();// get the current location path and assign as an object
    
    
    function inhomepage(){return location.pathname === '/';} //determine whether it is in homepage 

    if(inhomepage()){return null;}
    
    
    
    
    return (<>
    {/* the newly create function()=> is for prevent immediate execute when enter the page, allow for onclick
    while {function()} will immediate call at page enter*/}
 <IconButton onClick={()=>navigate(-1)} disabled={inhomepage()}><ArrowBackIosNewOutlined sx={{color:'white'}}/></IconButton>
</>);



}