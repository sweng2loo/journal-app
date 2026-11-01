import { app, BrowserWindow, dialog, ipcMain } from 'electron';
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

    ipcMain.handle('save-as-pdf',async(event)=>{// need to tell the renderer it is sucess so use invoke and handle
        const win = BrowserWindow.fromWebContents(event.sender);// set the mainwindow that need to execute this action, which is from who send it
         // if declared with {filePath}, it mean temporary nameless object but with filePath as key
        // also the dialog return an object with 2 key {filePath: ?? , canceled:??} 
        // so it is strictly filePath as key or else it will not work

            const  Pdfpath = await dialog.showSaveDialog(win, { 
               //win mean, set this dialog as modal of mainwindow, to prevent action in mainwindow
              title: 'Save As PDF', // title of this dialog
              defaultPath: 'journalreport.pdf', // default path to save, normally is in download folder
              filters: [{name:'PDF file',extensions:["pdf"]}] //  set the  extension selection for the option in right bottom corner
        
            });
        
            if (!Pdfpath.filePath) {//if there is no filepath, which mean calcelled or no such file path 
                 dialog.showMessageBox(win, {message:"Failure"}) //show electron own dialog messagebox, there are many optional argument you can find in their website
                //using electron messegabox instead of alert() is due to electron not support the alert() and will freeze the input box
                 return {success:false, reason:'cancel'};
          }
          // if there is filePath which mean you selected a file Path
            const data = await win.webContents.printToPDF({ // print to pdf
                preferCSSPageSize: true // use Css @page instead of default printToPDF design
            });
        
            await fs.promises.writeFile(Pdfpath.filePath, data); //write file to disk, promises is to wait for it to finish before execute next
            dialog.showMessageBox(win, {message:"Save Successfully"}) // electron message box

            return {success: true}; //tell the renderer it is success


    })



}