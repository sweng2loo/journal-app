import { Box, TextField, Typography } from "@mui/material";

export default function Inputbox({labeltext,name, type, mrow = 0, value, required = false}){
    return (
<>
<Box sx={{display:'flex'}}>
    <Typography variant='h6' sx={{
        fontSize:'clamp(10px, 2vw, 20px)',
        margin:0.5, 
        minWidth: '12vw', 
        maxWidth:'12vw', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis', 
        }}>{labeltext}</Typography><Typography variant="h6" sx={{mr:2,fontSize:'clamp(10px, 2vw, 20px)'}}>:</Typography>
    <TextField 
    variant="outlined"
    name={name}
    type={type}
    defaultValue={value}
    required={required}
    multiline 
    minRows={mrow} 
    size="small" 
    sx={{flexGrow:1}}/>
</Box>

</>

    );

}