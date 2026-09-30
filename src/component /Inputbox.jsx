import { Box, TextField, Typography } from "@mui/material";

export default function Inputbox({labeltext,name, type, mrow = 0, value, required = false}){
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