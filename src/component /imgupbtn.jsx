import { Button } from "@mui/material";
import { useEffect, useRef } from "react";

export default function Imgupbtn({fxtostaterefresh,fxtogetimg,imgselectedchange}){
    const chosenImg = useRef(null)
    useEffect(()=> {if (imgselectedchange === null){if(chosenImg.current){chosenImg.current.value = ""};}},[imgselectedchange]) //use to listen to outside uploadedfile state to determine selected file and mainly use to clear the previous selected file 

    function sendoutimg(){
         const getimg = chosenImg.current.files[0];

            if (getimg){
                const imgtemurl =  URL.createObjectURL(getimg);
             
                fxtostaterefresh(imgtemurl) //use the parent component useState function to rerender the parent component preview
                 }
            fxtogetimg(getimg); //use the parent component function to get img

        }

    return (<>
    <Button component="label" variant="contained" >Upload image
        <input 
        type='file' 
        accept="image/*"
        ref={chosenImg}
        onChange={sendoutimg}
        style={{display:'none'}}/>
        </Button>
    
    </>);

}