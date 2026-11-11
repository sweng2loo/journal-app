import { Box, Button, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { visuallyHidden } from '@mui/utils';

export default function ImageUpload({Childdata,value}){
        const chosenImg = useRef(null)
        const [previewImg, setPreview] = useState(null);
        // passively listen to the change of selectedimage variable of the parent component via "value" variable
        useEffect(()=>{if(value === null){
            setPreview(null);
            if (chosenImg.current) {chosenImg.current.value = "";}
                };
            }, [value])

        function handleimgchange(){
            const getimg = chosenImg.current.files[0];
           
            if (getimg){
                const imgtemurl= URL.createObjectURL(getimg)

                setPreview(imgtemurl);
            }
            
            Childdata(getimg)
            


        }
    return(
        <>
        <Stack spacing={2}>
       
        <Box sx={{mt:2, justifyContent:'center', height:'40vh', width: '35vw', border: '1px dashed grey'}}>
           { previewImg && (<Box component="img" src={previewImg} alt="havent decide" sx={{height:'100%', width: '100%', objectFit:'contain'}}/>
        )}</Box>
         <Box sx={{display:'flex'}}>
            <Button component="label" variant="contained"> Upload image<input 
            
            type='file' 
            accept="image/*"
            ref={chosenImg}
            onChange={handleimgchange}
            required
             style={visuallyHidden}/>
            </Button>
        </Box>
        
        
        </Stack>
        </>
    );





}