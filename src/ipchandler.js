import { app, ipcMain } from 'electron';
import path from 'node:path';
import fs from 'fs';
import Copyimgfile from './filerelatedfunction/copyimgfile';
import Deleteimgfile from './filerelatedfunction/deleteimgfile';

export default function Setuphandler(db){

    // function to add records
    ipcMain.handle('add-record',async (event, {date,particulars,attendants,specialremark,imagepath})=> {
        // need to make varible to store soon to made new path for img file
        let newpath = imagepath;
        // create a folder to store img file in specific location if there isnt any
        if (imagepath){// if there is an image file 
            const imgdatafolder = path.join(app.getPath('userData'),'imagedata_for_Journalapp'); // make the saveimglocation folder name reference
            if (!fs.existsSync(imgdatafolder)){ //if the foldername is no exist
                fs.mkdirSync(imgdatafolder, { recursive: true }); //create the new folder and its prev required folder according to the path
            }
        
        newpath = Copyimgfile(imagepath,imgdatafolder);

        }
       
        //use database function to record with all the info along with new path created justnow which point to the newly copied image file

        return await db.NewRecord(date,particulars,attendants,specialremark,newpath); 
    })



    ipcMain.handle('load-all', async(event) => {return await db.GetAllRecords();})

    ipcMain.handle('update-record', async(event,{id,date,particulars,attendants,specialremark,imagepath})=>{
        let newpath = imagepath;

        if (imagepath){// if there is an image file 
            const imgdatafolder = path.join(app.getPath('userData'),'imagedata_for_Journalapp'); // make the saveimglocation folder name reference
            if (!fs.existsSync(imgdatafolder)){ //if the foldername is no exist
                fs.mkdirSync(imgdatafolder, { recursive: true }); //create the new folder and its prev required folder according to the path
            }

        newpath = Copyimgfile(imagepath,imgdatafolder); // copy the img file
        const recordofdeleteselected = db.Deleteimg(id); // get the img path of img that want to delete

        Deleteimgfile(recordofdeleteselected);} //delete the image using the path
        


        return await db.UpdateRecord(id,date,particulars,attendants,specialremark,newpath); // update the record
    })
    
    ipcMain.handle('update-without-img', async(event,updateinput)=>{return await db.UpdataWithoutImg(updateinput)}) // use for update record without touching the img. dont need to copy and delete img

    ipcMain.handle('home-page-load', async(event)=>{return await db.HomepageYearload()}) // for homepage enter loading the database table

    ipcMain.handle('load-records-by-year', async(event,year)=>{return await db.LoadrecordbyYear(year)}) //  for load the database table using year

    ipcMain.handle('search-records', async(event,criteria)=> {return await db.SearchwithCriteria(criteria)}); // for search the database using search criteria
}