import { Box, Typography } from "@mui/material";

export default function Dateinputbox({labeltext,name, value, required = false, width = '12vw'}){
    return (
<>
<Box sx={{display:'flex'}}>
    <Typography  sx={{
        fontSize:'clamp(10px, 2vw, 20px)',
        margin:0.5, 
        minWidth: width, 
        maxWidth:'12vw', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis', 
        }}>{labeltext}</Typography><Typography sx={{fontSize:'clamp(10px,2vw,20px)',mr:2}}>:</Typography>
    <Box component="input" type="datetime-local" name={name} required={required} defaultValue={value} sx={{maxWidth:"100%", fontSize: 'clamp(12px, 1.2vw, 15px)'}}/>
    
   
</Box>

</>

    );

}