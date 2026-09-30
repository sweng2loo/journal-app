import fs from 'fs';


export default function Deleteimgfile(selectedrecord){
    if(selectedrecord && selectedrecord.imgpath){
        const deleteimgpath = selectedrecord.imgpath;
        if(fs.existsSync(deleteimgpath)) // check if there is file in this path, if the path is 'empty' then it also wont execute  
        {fs.unlinkSync(deleteimgpath);} // delete the file using the path 
        else {console.log("no such image file");} 
        ;

    }


}