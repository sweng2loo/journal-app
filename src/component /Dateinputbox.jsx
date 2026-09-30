import { Box, Typography } from "@mui/material";

export default function Dateinputbox({labeltext,name, value, required = false}){
    return (
<>
<Box sx={{display:'flex'}}>
    <Typography variant='h6' sx={{
        margin:0.5, 
        minWidth: '12vw', 
        maxWidth:'12vw', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis', 
        }}>{labeltext}</Typography><Typography variant="h6" sx={{mr:2}}>:</Typography>
    <Box component="input" type="datetime-local" name={name} required={required} defaultValue={value}/>
    
   
</Box>

</>

    );

}