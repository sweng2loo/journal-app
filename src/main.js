import { app, BrowserWindow, ipcMain, dialog, protocol, net } from 'electron';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import started from 'electron-squirrel-startup';
import AppDataBase from './database/database';
import Setuphandler from './ipchandler';

import Deleteimgfile from './filerelatedfunction/deleteimgfile';


//**protocol- this set the privilege meaning the permission to access thing with specific word store in scheme, so when it see "scheme://" then it grant special permission
protocol.registerSchemesAsPrivileged([{
  scheme: 'image',
  privileges :{secure:true, supportFetchAPI:true,bypassCSP:true, standard:true}
}]);

let mainWindow; // declare as global to enable control of child windows from main window 
let recorddb; // declare a varible to store the database everytime app start
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
let ActiveChildWindow;
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
   mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

//open new window and lock the main window
 function makechild(page ,color = '#FFFFFF'){

  if(ActiveChildWindow){
    if (ActiveChildWindow.isMinimized()) ActiveChildWindow.restore();
    ActiveChildWindow.focus();
    return ActiveChildWindow;
  }

  const zhuyao = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0]
  const childWindow = new BrowserWindow({ 
    width: 600, 
    height: 400,
    parent: zhuyao, 
    modal: true,        
    show: false,
    backgroundColor: color,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });


  ActiveChildWindow = childWindow;

  childWindow.on('closed',()=>{ActiveChildWindow = null;})


  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/#/${page}`);//load the url according to the router
  } else {
    childWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),//same but different method due to previous fail
      { hash: page }
    );
  }// the actual content handling will be in hashrouter in renderer.jsx then direct to entry page

  childWindow.once('ready-to-show', () => childWindow.show());// show the child window when ready

  return childWindow;
}
//close the new window
function closechild(event){
  const wind = BrowserWindow.fromWebContents(event.sender);
  if (wind){wind.close();}
  ;

}

// for delete and confirmation 
async function deleterecord(event, id){
  const focusedwindow = BrowserWindow.fromWebContents(event.sender)// get the current using window 
  ;
  //forbid ithe current using window and open confirmation dialog
  const result = await dialog.showMessageBox(focusedwindow,
    {
      message: 'Are you sure to delete the record?',
      type : 'question',
      buttons:['No','Yes'],
      defaultId: 0,
      title: 'Confirm Delete?',
    
    }
  );
  if (result.response === 1){ //confirm with respond 1 (yes) 
    
    const recordofdeleteselected = recorddb.Deleteimg(id); // get the record via id only

    Deleteimgfile(recordofdeleteselected);

    await recorddb.DeleteRecord(id); // delete the record in database
    return true
    ;}

  return false; // nothing happen if respond 0 (no)

}






// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // the protocol.handle listen the signal with "image://"(**which defined in the protocol at top)  and execute some function with request as parameter before return something to the request sender.
  protocol.handle('image',(request) =>{ // the request also hold the value of the whole image://${thevalue}
    //this decode the uri component (**meaning translate all special charater for computer to read properly) 
    // and the replace function replace(/anything inside/, 'with this') 
    // the '^' mean need to in exact same order, 
    // the "\" mean the next character is special specific thing such as \n is newline, in this case , it mean "/" but avoid closing just like relationhip when '' inside "" 
    // "+" mean any same character as before after it also count
    // finally close with"/", 
    // i or g or m is decide whether it case sensitive meaning can a be A or must be a
    // so it actually mean replace      "image://nousefolder/"    the // at the end can be more than 1, must be in this order and case insensitive 
    
    let changemediapath = decodeURIComponent(request.url.replace(/^image:\/\/nousefolder\/+/i, ''));
    

    if (process.platform !== 'win32'){// it check  if the OS is Window, 'win32' is the value represent window OS 
        if(!changemediapath.startsWith('/')){//if it is not, then check whether the modified path start with '/' because linux and Mac path need to start with it
          changemediapath = `/${changemediapath}`; // if not, the add the / in front of it.
        }
    }// if the OS is window, just use the modified path directly


  // finally use the fetch to send back to the request location with granted permission
  //pathtofileurl() is use for convert local file into URL for web browser to properly read it
  // net.fetch is electron function to read local file by security reason due to it is mainly a web browser
    return net.fetch(pathToFileURL(changemediapath).href);
  });
  recorddb = new AppDataBase(); // construct the database 
  Setuphandler(recorddb) // refer to ipchandler.js to listen to the event from ipc renderer its use for all main process function request from frontend. its the same as all ipcMain function as below, only group into a file and call it for easier management

  createWindow();


  

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

ipcMain.on('any-child',(event,page) => makechild(page)); // since it doesnt need to return anything to main window so use ipcrenderer.send and ipcmain.on

ipcMain.on('close-child',closechild);

ipcMain.handle('confirm-delete', deleterecord) // since it need to return respond, so use ipcrenderer.invoke and ipcMain.handle

ipcMain.on('view-in-detail', (event, Squery)=>{ // wait for the view in detail signal and receive the search criteria from child window


        if( mainWindow && !mainWindow.isDestroyed()){
          mainWindow.webContents.send('view-search', Squery); // initiate by main.js and send through webcontents to the main window through ipc renderer
          mainWindow.focus(); // select the main window bring to the front
        }

        const childWindow = BrowserWindow.fromWebContents(event.sender); // identify child window with event.sender (who initiate this view in detail )
         if( childWindow && !childWindow.isDestroyed()){ //check whether the child window is there
          childWindow.close(); // close the child window
        } 
          // result: send the search criteria to main window (the /mainlayout page), bring the mainwindow into control and close the child window. 
    })


  

  /*ipcMain.on('print-preview',(event, page, report)=>{ //open child window then send the report data to the childwindow when it finish load
    let prevwindow = makechild(page,'#525659');
    
    prevwindow.webContents.on('did-finish-load',()=>{
      prevwindow.webContents.send('preview-report',report);
    })
  })*/ //discarded due to not needed a new childwindow to preview, unless use iframe to proper show the page break
    





// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  recorddb.closeDatabase();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});




// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
