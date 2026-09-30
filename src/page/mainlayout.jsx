
import { AppBar, Toolbar,Box, Typography, IconButton, colors } from "@mui/material";
import { Outlet } from "react-router";
import Backbutton from "../component /backbutton";

export default function Mainlayout(){

    return (
        <>
        <Box>
            <AppBar position="static">
                <Toolbar variant="dense" sx={{position:'relative', display:'flex'}}>
                 <Backbutton/>  
                <Typography variant="h5" sx={{position:'absolute', left: '50%', transform: 'translateX(-50%)'}}>Journals</Typography>
                </Toolbar>
            </AppBar>

            {/* the main background with checker box design */}
            <Box component="main" sx={{flexGrow:1, p:2, backgroundImage: 'repeating-conic-gradient(#e0f7fa 0% 25%, #ffffff 25% 50%)', backgroundSize: '60px 60px'}}>
                <Outlet/>
            </Box>
                
        
        
        
        </Box>

        </>

    );


}