import { Button } from "@mui/material";
import { useEffect, useRef } from "react";

export default function Imgupbtn({fxtostaterefresh,fxtogetimg}){
    const chosenImg = useRef(null)
   

    function sendoutimg(){
         const getimg = chosenImg.current.files[0];

            if (getimg){
                const imgtemurl =  URL.createObjectURL(getimg);
             
                fxtostaterefresh(imgtemurl) //use the parent component useState function to rerender the parent component preview,** this function is actually previewchange() created by parent usestate
                 }
          
            fxtogetimg(getimg); //use the parent usestate function to get img **this function is actually updateimg() created by parent usestate

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