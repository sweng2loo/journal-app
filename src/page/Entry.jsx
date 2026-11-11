
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from "@mui/material";
import Inputbox from "../component/Inputbox";
import ImageUpload from "../component/imageupload";
import { useState } from "react";
import Dateinputbox from "../component/Dateinputbox";


export default function Entry(){
    const [imgfileselected, setselectedimg]=  useState(null)

    function handleChilddata(datafromchild){
        setselectedimg(datafromchild);
        
    }

    async function handleSubmit(e){
        e.preventDefault();
        const file = imgfileselected;  //get image file itself

        const fdata = new FormData(e.currentTarget); // create new form variable to store all submitted data

        // extract each fdata by name and bundle into an object
        const recordinput = {
        date: fdata.get('date'),
        attendants: fdata.get('attendants'),
        particulars: fdata.get('particulars'),
        specialremark: fdata.get('specialremark'),
        imagepath: "" 
        }   
        // send the formadata object and the file object separately because formdata cant have object
        const result = await window.anyapi.AddRecords(recordinput, file);


        console.log('Form submited!', result);
        e.target.reset(); // clear form
        setselectedimg(null); // set selecting img to null
        
        
    }

    function cancel(){
        if (window.anyapi){
            window.anyapi.closeChild();
        } else{
            console.log('something wrong!');

        }
        
    }
    
return (
<>
{/* background pattern */}
<Box sx={{backgroundImage: 'repeating-conic-gradient(#e0f7fa 0% 25%, #ffffff 25% 50%)', backgroundSize: '60px 60px'}}>
<AppBar position="static">
                <Toolbar variant="dense" sx={{display:'flex', justifyContent:'center'}}>
                <Typography variant="h5">New Entry</Typography>
                </Toolbar>
            </AppBar>
<Container maxWidth="md" sx={{backgroundColor:'white',p:5}}>
<form onSubmit={handleSubmit}>
    <Stack spacing={3}>
    <Box sx={{display:'flex',height:'40vh', width:'60vw', justifyContent:'center', alignItems:'center', p:3}}>
        <ImageUpload Childdata={handleChilddata}  value={imgfileselected}/> 
    </Box>
        <Dateinputbox labeltext="Date" name="date" required={true} />
        <Inputbox labeltext="Attendants" name="attendants" required={true}/>
        <Inputbox labeltext="Particular" name="particulars" mrow='3'/>
        <Inputbox labeltext="Special Remark" name="specialremark"/>
        <Box sx={{display:'flex', justifyContent:'space-between', mt:3}}>
            <Button variant="contained" onClick={cancel}>Cancel</Button>
            <Button variant="contained" type="submit">Submit</Button>
        </Box>
    </Stack>


</form>

</Container>
</Box>
</>);


}