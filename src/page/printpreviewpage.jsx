
import PrintPreview from "../component/printpreview";
import { useEffect, useState } from "react";
import { AppBar, Container, IconButton, Slide, Toolbar, Typography, useScrollTrigger } from "@mui/material";
import { PrintOutlined } from "@mui/icons-material";


// discarded due to improper print preview page, may need to use iframe to properly display print preview
export default function PrintPreviewPage(){
    const [preview, setpreview] = useState(null);
    const [otherinfo, setotherinfo] = useState(null);

    function HideOnScrolls(contentinside){// this is the component for hiding the appbar when scrolldown
        const {children} = contentinside; // this is thing that want to hide
        const trigger = useScrollTrigger(); // useScrollTrigger will make the scroll action become trigger for an action 


        //slide is use for hiding the the children component with animation, return statement is for this function to create this component
        return(<Slide appear={false} direction="down" in={!trigger}>
                {children}
        </Slide>);
    }



    useEffect(()=>{// use for receive the data and set the data for report preview ,
        //switch off the listener after exit or renew using retrun statement
        const clearlistener = window.anyapi.waitforpreview((report)=>{
                        setpreview(report.printdata);
                        setotherinfo(report.reportinfo) ;  
                    });
                return () => clearlistener();    
            }, [])
    
    return(
        <>
        <HideOnScrolls className="no-print"> {/*hide the app bar when scroll down */}
            <AppBar className='no-print' sx={{background:"#444444"}} elevation={10} >
                <Toolbar sx={{position:'relative', display:'flex', width:'100%'}}>
                    <Typography  variant="h4"  sx={{color:"white",position:'absolute', left: '50%', transform: 'translateX(-50%)'}}> Print Preview</Typography>
                    <IconButton onClick={()=>window.print()}sx={{backgroundColor:"#444444",position:'relative', left:"85%",borderRadius:2}}><PrintOutlined sx={{color:"white", fontSize:"40px"}}/></IconButton>
                </Toolbar>
            </AppBar>
        </HideOnScrolls>
        <Toolbar className="no-print"/>

            <Container className="hide-it" sx={{display:'flex', justifyContent:'center'}}> {/*use to center the component*/}
             <PrintPreview className="printable" datatable={preview} reportdata={otherinfo}/> {/*report preview*/}
            </Container>
        </>
        
        
    );
}