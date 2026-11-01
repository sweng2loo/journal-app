// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer, webUtils } from 'electron';

contextBridge.exposeInMainWorld('anyapi', {
openChild(page){ipcRenderer.send('any-child',page)},
closeChild(){ipcRenderer.send('close-child')},
async DeleteRecord(id){ return await ipcRenderer.invoke('confirm-delete',id)},
async AddRecords(recordinput, imgfile){ // before carry to the ipcmain, extract the imgfile(object) path with webUtils 
                const imgpath = imgfile ? webUtils.getPathForFile(imgfile) : "";
                recordinput.imagepath = imgpath; // and store the path string into the recordinput
                return await ipcRenderer.invoke('add-record',recordinput)}, // send this databundle object to the ipcmain to add record to database
async LoadallRecords(){return await ipcRenderer.invoke('load-all')},
async UpdateRecord(updateinput, imgfile){
                const imgpath = imgfile ? webUtils.getPathForFile(imgfile) : "";
                updateinput.imagepath = imgpath;
                return await ipcRenderer.invoke('update-record',updateinput)},
async UpdateWithoutimg(updateinput){return await ipcRenderer.invoke('update-without-img',updateinput)},
async homepageload(){return await ipcRenderer.invoke('home-page-load');}, // for homepage initial load for show what year have records
async LoadRecordsByYear(year){return await ipcRenderer.invoke('load-records-by-year',year)}, //load the record accoding to the year
async SearchRecord(criteria){return await ipcRenderer.invoke('search-records',criteria)}, // get criteria from search page and send to ipcmain, wait for the result table 
ViewInDetail(Squery){ipcRenderer.send('view-in-detail', Squery)}, // send the search criteria from search child page to the ipcmain for later use in /record page 
ReceiveSquery(action){ // listen for the search query receive from ipcmain and send to front end mainlayout page 
    function listenforSquery(event,Squery){action(Squery)}; //store the listener function in a variable for later stop listen purpose
    ipcRenderer.on('view-search',listenforSquery );// then execute the listener function when ipcmain sent the signal 
    return () => {ipcRenderer.removeListener('view-search',listenforSquery)};// create a temporary function to stop listener function and return it to frontend to enable control from frontend
},
async SaveAsPDF(){ return await ipcRenderer.invoke('save-as-pdf')}, // tell main to printToPDF with current window content, use invoke to received reply of success or failure

//this two function is discarded as related to child page print preview which is current unnecessary due to no page break display
//Printpreview(page, report){ipcRenderer.send('print-preview', page, report)}, // request to open child page for preview, send the report and criteria over ipcMain
/*waitforpreview(whenreceived){ // receive the preview report and load it over the child window to preview
    function listenforpreview(event,report){whenreceived(report)}; //declare the function for listener
    ipcRenderer.on('preview-report', listenforpreview);
    return () => {ipcRenderer.removeListener('preveiw-report',listenforpreview)}; give stop the listener function for the page to use
},*/


}



);
