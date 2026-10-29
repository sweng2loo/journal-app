
import { AppBar, Toolbar,Box, Typography, IconButton, colors } from "@mui/material";
import {  Outlet, useNavigate } from "react-router";
import Backbutton from "../component /backbutton";
import { useEffect } from "react";
import "../css/printpage.css"

export default function Mainlayout(){
    const navigate = useNavigate(); // allow for auto navigate to page without having to click a button

    useEffect(()=>{if (window.anyapi && window.anyapi.ReceiveSquery){ //wait for the signal 
        const stoplisten = window.anyapi.ReceiveSquery((Squery)=>{ navigate('/records',{state:{criteria: Squery}})
        });// assign the return stop listen function from ipcrenderer to a variable as function and execute receiveSquery()
        //since the ReceiveSquerey(action)need a function as parameter, it pass a lambda one line function and the function is use to navigate to /records page, 
        // and bring an object named criteria match with the state(one of navigate properties)) key
        // the object(named criteria) brought to recordpage is the search criteria from child window(through ipc> main > ipc > main window)
        return () =>{stoplisten();}// execute the received stop listen function from ipcrenderer to stop them from keep listen
    }},[navigate]) // listen for the change in page

    return (
        <>
        <Box sx={{display:"flex", flexDirection: 'column', width:'100%',flexGrow:1}}>
            <AppBar position="static" sx={{flexGrow:1}} >
                <Toolbar variant="dense" sx={{position:'relative', display:'flex', width:'100%'}}>
                 <Backbutton/>  
                <Typography variant="h5" sx={{position:'absolute', left: '50%', transform: 'translateX(-50%)'}}>Journals</Typography>
                </Toolbar>
            </AppBar>

            {/* the main background with checker box design */}
            <Box component="main" sx={{flexGrow:1, p:2, backgroundImage: 'repeating-conic-gradient(#e0f7fa 0% 25%, #ffffff 25% 50%)', backgroundSize: '60px 60px', minWidth:0, width:'100%', overflowX: "auto"}}>
              
                <Outlet/>
              
            </Box>
                
        
        
        
        </Box>

        </>

    );


}