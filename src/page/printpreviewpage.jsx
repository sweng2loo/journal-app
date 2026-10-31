import Button from "@mui/material/Button";
import PrintPreview from "../component /printpreview";
import { useEffect, useState } from "react";
import { AppBar, Container, IconButton, Slide, Toolbar, Typography, useScrollTrigger } from "@mui/material";
import { PrintOutlined } from "@mui/icons-material";
  
export default function PrintPreviewPage(){
    const [preview, setpreview] = useState(null);
    const [otherinfo, setotherinfo] = useState(null);

    function HideOnScrolls(contentinside){
        const {children} = contentinside;
        const trigger = useScrollTrigger();

        return(<Slide appear={false} direction="down" in={!trigger}>
                {children}
        </Slide>);
    }



    useEffect(()=>{
        const clearlistener = window.anyapi.waitforpreview((report)=>{
                        setpreview(report.printdata);
                        setotherinfo(report.reportinfo) ;  
                    });
                return () => clearlistener();    
            }, [])
    
    return(
        <>
        <HideOnScrolls className="no-print">
            <AppBar className='no-print' sx={{background:"#444444"}} elevation={10} >
                <Toolbar sx={{position:'relative', display:'flex', width:'100%'}}>
                    <Typography  variant="h4"  sx={{color:"white",position:'absolute', left: '50%', transform: 'translateX(-50%)'}}> Print Preview</Typography>
                    <IconButton onClick={()=>window.print()}sx={{backgroundColor:"#444444",position:'relative', left:"85%",borderRadius:2}}><PrintOutlined sx={{color:"white", fontSize:"40px"}}/></IconButton>
                </Toolbar>
            </AppBar>
        </HideOnScrolls>
        <Toolbar className="no-print"/>

            <Container className="hide-it" sx={{display:'flex', justifyContent:'center'}}>
             <PrintPreview className="printable" datatable={preview} reportdata={otherinfo}/>
            </Container>
        </>
        
        
    );
}