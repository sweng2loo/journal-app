import { Box, Button, Container, Fab, Stack, Typography } from "@mui/material";
import Datadisplaybox from "../component/Datadisplaybox";
import { ArrowBackIos, ArrowForwardIos, CachedRounded, DeleteForeverRounded, EditRounded, NoteAddRounded } from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
import Imgupbtn from "../component/imgupbtn";
import Inputbox from "../component/Inputbox";
import Dateinputbox from "../component/Dateinputbox";
import {  useLocation, useParams } from "react-router";
import Picture from '../pic/noimg.png';




export default function Records(){
    //variable declaration and initialization
    const [temprecordstable, settable] = useState([]);// current database table, useState allow initialization and make settable as a function to update the variable
    const [recordindex, setindex] = useState(0);// current record index, meaning the single record that is viewing 
    const [editmode, setmode] = useState(false); // change edit mode, use as flag to disable some button such as next and previous, new record and etc, it also enable edit related button
    const [preview, previewchange] = useState(null); // img for  img preview box
    const [editrecord, setedit] = useState(null);//the selected record in edit mode
    const [imguploaded, updateimg] = useState(null); //uploaded image in the img input box, different from the previewbox
    const { year } = useParams(); // use param return an object which you defined the key in the hashrouter route /:year
    const Squery= useLocation();// uselocation extract the object create and come with the usenavigate() such as pathname, key, state, etc
    
    //function declaration
    function toeditmode(change){
        setmode(change); // all setter function of react will only execute at the end of funtion not matter where it is.
        if(change === true){// so track change variable instead of the editmode
        const selectedrecord = temprecordstable[recordindex]; //extract current viewing record data 
        const imgbeforupdate = `image://nousefolder/${temprecordstable[recordindex].imgpath}`; // extract current viewing record imgpath for preview only, file itself is too difficult to be extract using path
        previewchange(imgbeforupdate); //set the preview in editmode **this is for the preview box only, no file is actually selected for the input
        updateimg(null); // clear the selected input img each times enter editmode
        setedit(selectedrecord);}//set the record data into all the inputbox except img file
    }

    function istableempty(){return temprecordstable.length === 0;} // check if the current database table is empty to disable the next or prev and edit mode button and etc


    async function handleDelete() { // delete the record, send signal to ipc  in preload.js for further action
        const deleteid = temprecordstable[recordindex].id;
        
        const confirm = await window.anyapi.DeleteRecord(deleteid);

        if(confirm){console.log('record deleted');
            if(recordindex === 0)(loadtherecords(0))
           else {loadtherecords(recordindex - 1);}}

        else{ console.log('nothing happen');}
    }

     function NewRecord(){ // open new record , send signal to ipc in preload.js for further action 
        if (window.anyapi){
            window.anyapi.openChild('Entry');
            
        }else{console.log("something wrong");}
        
    };

    async function HandleUpdate(e){// take the file from imguploaded variable (which mean the img input uploaded) and gather input data using formdAta
        e.preventDefault();
        const file = imguploaded;
        const inputdata = new FormData(e.currentTarget);
        // pack all the form data into an object
        const databundle = {
            id: editrecord.id,
            date: inputdata.get('date'),
            attendants: inputdata.get('attendants'),
            particulars: inputdata.get('particulars'),
            specialremark: inputdata.get('specialremark'),
            imagepath:''
        }
        if (file){// if there is img file uploaded then normal update by send the file and data to ipc for further action
            const result = await window.anyapi.UpdateRecord(databundle, file);
            console.log('record has been updated',result);}
        else{// if not send the data only with different ipc function for further action  
            
            const result = await window.anyapi.UpdateWithoutimg(databundle);
            console.log('record has been updated without img', result);
        }   ; 

        toeditmode(false); // after edit, exit edit mode
        loadtherecords(); // reload the page or the record table
     
    }
        

    async function loadyear(getyear,targetindex){// function for loadtherecords to be use in useEffect to load specific year records only
        const loadedtable = await window.anyapi.LoadRecordsByYear(getyear)//although it is automated in loadtherecords(), this parameter is get from the year by useParams
        settable(loadedtable);
        setindex(targetindex);}
            
//use callback to freeze the function at initial state and only allow the [recordindex] to change, if it is [] then the variable inside the function will also be freeze even it is changed at somepoint
    const loadtherecords = useCallback( async function loadrecords(targetindex = recordindex){
        const searchcriteria = Squery.state?.criteria; //extract the data get with uselocation more specificlly, in this case, we extract the criteria object inside the state key create from previous usenavigate() in mainlayout
        if (searchcriteria != null){// if there is a searchcriteria extracted, also use to prevent loss of search result when refresh
           const result = await window.anyapi.SearchRecord(searchcriteria);  // Search the database using the criteria send from child window through ipc > main >ipc > mainlayout > usenavigate > uselocation 
           settable(result); // set as the table
           setindex(targetindex)
        }
        else if (year != null){// this year object key is extracted useing useparam() at above declaration, if click all record from the last page, then it is null
            if(window.anyapi){loadyear(year,targetindex)};  // use the loadyear() instaead of normal loadall function
        }else{//if click all record from the last page, then the year is null
            
            if(window.anyapi){
            const loadedtable = await window.anyapi.LoadallRecords(); // ipc load all function for further action
            settable(loadedtable); // set the database table after getting the result from ipc
            if (loadedtable.length === 0) 
                {console.log("there is no records!!!");
                    setindex(0);
                    }else{
            setindex(targetindex)};} //set the index so it wont change
            }}
    ,[recordindex])
    


    function NextRecords(){
        if(recordindex < temprecordstable.length - 1 ){setindex(recordindex +1 )};
    }
    function PrevRecords(){
        if(recordindex > 0 ){setindex(recordindex - 1 )};
    }


    //main process and page
    useEffect(()=>{loadtherecords();},[location.state]);// load the data and set to the database table each time enter the page. which function to load has been include if else in the loadtherecords()
        
            
    return (<>
        <Box >
        <Container maxWidth="md" sx={{ backgroundColor: 'white', p: 3, borderRadius: 2 }}>
            <Stack spacing={2}>


                    
                {!editmode && //float button  only appear when not editmode
                <Box sx={{display:'flex', justifyContent:'space-between', mx:2 }}>
                    <Fab color="primary" onClick={NewRecord}><NoteAddRounded/></Fab>
                    <Fab color="info" onClick={()=>loadtherecords()}><CachedRounded/></Fab>
                    <Fab color="success" onClick={() => toeditmode(true)} disabled={istableempty()}><EditRounded/></Fab>
                    <Fab color="error" onClick={handleDelete} disabled={istableempty()}><DeleteForeverRounded/></Fab>
                </Box>
                }



                <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                        {!editmode && //prev and next button      at the img box, because electron doesnt allow direct load from local machine, it require set up new priviledge with certain accessing method, go to main.js **protocol to know more 
                        <Fab color='primary'onClick={PrevRecords} disabled={recordindex === 0}><ArrowBackIos/></Fab>}
                        <Box component="img" src={editmode ? preview : temprecordstable[recordindex]?.imgpath ? `image://nousefolder/${temprecordstable[recordindex]?.imgpath}` : Picture} alt="No image found" sx={{height:'50vh', width: ' 40vw', mx:2}}/>
                        {/* the preview box, is not related to the input box. due to ipc, accesing img require special protocol declaration(special privilige) in ipc main and special "img://" protoco.handle, then use the dummyfolder name to prevent some chromium change the path name due to some domain thing, in this case i named it 'nousefolder' */}
                        {!editmode && 
                        <Fab color='primary' onClick={NextRecords} disabled={recordindex === temprecordstable.length - 1 || istableempty()}><ArrowForwardIos/></Fab>}    
                </Box> 




                {!editmode && // information display, the Disdate is extra table column preload by database using sql stmt to remove the 'T' in EventDate column 
                <><Datadisplaybox labeltext="Date" context={temprecordstable[recordindex]?.DisDate}/>
                <Datadisplaybox labeltext="Attendants" context={temprecordstable[recordindex]?.Attendants}/>
                <Datadisplaybox labeltext="Particular" boxheight="100px" context={temprecordstable[recordindex]?.Particulars}/>
                <Datadisplaybox labeltext="Special Remark" context={temprecordstable[recordindex]?.SpecialRemark}/>
                    <Box sx={{display:'flex',justifyContent:'center'}}>
                        { temprecordstable.length > 0 ? <Typography variant='h8'>{recordindex + 1} of {temprecordstable.length} records</Typography>:
                        <Typography variant='h8'>No record</Typography>}
                    </Box>
                </>}






                {editmode && //change the whole page to component that allow input
                    <form onSubmit={HandleUpdate}>
                        <Stack spacing={2}>
                        <Box sx={{display:'flex', justifyContent:'center'}}><Imgupbtn fxtostaterefresh={previewchange} fxtogetimg={updateimg} /></Box>                 
                        <Dateinputbox labeltext="Date" name="date" value={editrecord.EventDate} required={true} />
                        <Inputbox labeltext="Attendants" name="attendants" value={editrecord.Attendants} required={true}  />
                        <Inputbox labeltext="Particular" name="particulars" mrow='3' value={editrecord.Particulars}/>
                        <Inputbox labeltext="Special Remark" name="specialremark" value={editrecord.SpecialRemark}/>

                        <Box sx={{display:'flex', justifyContent:'space-between', mt:8}}>
                            <Button variant="contained" onClick={() => toeditmode(false)}>Cancel</Button>
                            <Button variant="contained" type="submit">Save</Button>
                        </Box> 
                        </Stack>
                    </form>}
            </Stack>

        </Container>
        </Box>

        </>);
}