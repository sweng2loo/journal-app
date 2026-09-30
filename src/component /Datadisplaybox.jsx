import { Box, Typography } from "@mui/material";

export default function Datadisplaybox({labeltext, boxheight = "auto", context = "There is no record"}){

    return (
<>
<Box sx={{display:"flex"}}>
    <Typography variant="h6" sx={{ 
        minWidth: '12vw', 
        maxWidth:'12vw', overflow: 'hidden', 
        textOverflow: 'ellipsis', 
        }}>{labeltext}</Typography><Typography variant="h6" sx={{mr:2}}>:</Typography>
    <Box sx={{
        border: '1px solid black',
        borderRadius: 1,
        flexGrow:1, 
        p:1,
        minHeight: boxheight, 
        minWidth:0, 
        wordBreak: 'break-word'}}>{context}</Box>
</Box>
</>

    );
}