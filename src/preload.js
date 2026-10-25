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
async homepageload(){return await ipcRenderer.invoke('home-page-load');},
async LoadRecordsByYear(year){return await ipcRenderer.invoke('load-records-by-year',year)},
async SearchRecord(criteria){return await ipcRenderer.invoke('search-records',criteria)},

}

);
