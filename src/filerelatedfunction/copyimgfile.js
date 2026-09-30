import path from 'node:path';
import fs from 'fs';


// get the img file .xxx name then make a new name out of it and assign to the newpath varible(create new path for new file)
export default function Copyimgfile(orifilepath,savetofolder){
    let copiedimgpath;
    
    const fileExtension = path.extname(orifilepath); // assign the same .xxx as the file including the .
    const renamecopyimage = `${Date.now()}-${Math.floor(Math.random() * 1000)}${fileExtension}`;
    copiedimgpath = path.join(savetofolder, renamecopyimage); //assign the new path and file name for saving


    fs.copyFileSync(orifilepath,copiedimgpath); // copy the file from source path to new folder using new path


    return copiedimgpath;

}