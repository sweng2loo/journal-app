import { Box, Button, Container, Stack, Typography,} from "@mui/material";
import Dateinputbox from "../component /Dateinputbox";
import Inputbox from "../component /Inputbox";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import PrintPreview from "../component /printpreview";







export default function PrintPage(){
    
    const [dataresult, setresult] = useState(null); // the search result 
    const [Criteria, setcriteria] = useState(null); // the search criteria for setting the report range data also
    const datacolumn = [ // for the datagrid use, it required unique field as key, and valueGetter allow for customize value for this field
        {field:"numbering", headerName:"#",maxWidth:30, minWidth:10,valueGetter: (value, row) => dataresult.indexOf(row) + 1},
        {field:"DisDate", headerName:"Date", maxWidth:120, minWidth:10}, 
        {field:"Attendants", headerName:"Attendants", maxWidth:100, minWidth:10},
        {field:"Particulars", headerName:"Particulars", maxWidth:200, minWidth:10},
        {field:"SpecialRemark", headerName:"Sp remark", maxWidth:100, minWidth:10},
    ] 
    const paginationModel = {pageSize:4 }// for mui datagrid use, allow the number of record show each page
    const [isSaving, Saving] = useState(false); // state whether the system is saving, use for prevent multiple execution when click save

    async function Search(e){ // search with input criteria
            e.preventDefault();
            const fdata = new FormData(e.currentTarget);
            const searchcriteria = { // bundle the input into one object for send to main.js
                startDate:fdata.get('startdate'),
                endDate:fdata.get('Enddate'),
                Attendants:fdata.get('attendants'),
                Particulars:fdata.get('particulars'),
                SpecialRemark:fdata.get('specialremarks'),
                ForPrint: true // make the record ascending order with date
            }
            setcriteria(searchcriteria); // set the criteria for report data
            const result = await window.anyapi.SearchRecord(searchcriteria);//send to main.js through ipcRenderer
            setresult(result);//save the result table for display purpose
            ;
        }



    function Resetresult(){// clear search result , the clear form is implement inside <form> <button type='reset'> 
        setresult(null);
    }

    async function SavePdf(e){ // save the result as pdf by using BrowserWindow.Webcontents.printToPDF in main.js
        e.preventDefault(); //prevent browser any automatic default action
        
        if(isSaving){return} //check if the status is currently saving file 
                                // if yes, nothing happen (to prevent multiple execute due to multiple click)
        Saving(true); // set to nowSaving to prevent multiple click execute

        if(window.anyapi){
            try{// try mean execute the code inside see if there is any error, if yes, go to catch
                const result = await window.anyapi.SaveAsPDF(); // tell ipcMain to printToPDF, i will use ipcrenderer.invoke to received reply of success saving
                if(result.success){// log the reply
                    console.log("Save sucessfully.");
                    
                }
                else { console.log("Failure!"); //log the reply
                    
                }

            }catch(err){//any unexpected error will log the error and prevent code from further execute
                console.error(err);
            }
        }

        Saving(false);//reset the saving state to indicate finish saving and allow for next save
    }
    
    //this is for the open new child page print preview, discarded due to the page cant properly display page break thus, pointles to have
    /*function fnPrintPreview(){ 
        const report = {printdata: dataresult,
                        reportinfo: Criteria
        }

      
        if(window.anyapi){
            window.anyapi.Printpreview("printpreviewpage", report);
        }
    }*/



    return(
        <>
        <Container className="hide-it"> {/*make the whole page at middle */}
            {/*upper part of the page, search box and mui datagrid box */}
        <Box className="no-print" sx={{display:'flex', justifyContent:'center',gap:3}}>
            {/*searhbox */}
            <Box sx={{background:'white', p:2, boxShadow:4, maxWidth:'40vw',minWidth:'300px'}}>
                <form onSubmit={Search}>
                <Stack spacing={1}>
               
                    <Dateinputbox labeltext="From" name="startdate" required/>
                    <Dateinputbox labeltext="To" name="Enddate" required/>
                
                <Inputbox labeltext="Attendants" name="attendants"/>
                <Inputbox labeltext="Particulars" name="particulars"/>
                <Inputbox labeltext="Special Remark" name="specialremarks"/>
                <Box sx={{display:'flex', justifyContent:"space-between", maxWidth:'100%',minWidth:0}}>
                    <Button variant="contained" onClick={Resetresult} type="reset">Reset</Button>
                    <Box sx={{display:'flex', gap:2}}>
                        <Button variant="contained" onClick={SavePdf}disabled={dataresult === null || dataresult.length === 0}>Save as PDF</Button>
                        <Button variant="contained" type="submit" sx={{fontSize:'clamp(10px, 2vw, 14px)', minWidth:'auto', px: 'clamp(12px, 2vw, 16px)',}}>Search</Button>
                    </Box>
                </Box>
                
                </Stack>
                </form>
            </Box>

            {/*mui datagrid box */}
            <Box sx={{background:'white', boxShadow:4, overflow:'auto',flexShrink:1,minWidth:"150px"}}>
                {/*this DataGrid component is from mui material, row mean result, column mean header(need unique id), slotProps mean the custom action slot in btm */}
                {/*datagrid is form automatically. it is a premade table*/}
                <DataGrid rows={dataresult} columns={datacolumn} initialState={{pagination:{paginationModel}}} pageSizeOptions={[4]} slotProps={{pagination:{labelRowsPerPage:""}}}/>
            </Box>
        </Box>

        {/*btm part of the page, report preview, the <printpreview/> is custom component*/}
        <Box className="hide-it" sx={{display:'flex',minHeight:'29.7cm', justifyContent:'center'}}>
            {dataresult?.length >0 && <PrintPreview datatable={dataresult} reportdata={Criteria}/>}
            
        
        </Box>
        

        </Container>
        </>
    );


}