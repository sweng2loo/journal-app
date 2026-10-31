import { Box, Button, Container, Stack, Typography,} from "@mui/material";
import Dateinputbox from "../component /Dateinputbox";
import Inputbox from "../component /Inputbox";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import PrintPreview from "../component /printpreview";







export default function PrintPage(){
    
    const [dataresult, setresult] = useState(null);
    const [Criteria, setcriteria] = useState(null);
    const datacolumn = [
        {field:"numbering", headerName:"#",maxWidth:30, minWidth:10,valueGetter: (value, row) => dataresult.indexOf(row) + 1},
        {field:"DisDate", headerName:"Date", maxWidth:120, minWidth:10}, 
        {field:"Attendants", headerName:"Attendants", maxWidth:100, minWidth:10},
        {field:"Particulars", headerName:"Particulars", maxWidth:200, minWidth:10},
        {field:"SpecialRemark", headerName:"Sp remark", maxWidth:100, minWidth:10},
    ] 
    const paginationModel = {pageSize:4 }

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



    function Resetresult(){
        setresult(null);
    }
    

    function fnPrintPreview(){
        const report = {printdata: dataresult,
                        reportinfo: Criteria
        }

      
        if(window.anyapi){
            window.anyapi.Printpreview("printpreviewpage", report);
        }
    }



    return(
        <>
        <Container className="hide-it">
        <Box className="no-print" sx={{display:'flex', justifyContent:'center',gap:3}}>
            <Box sx={{background:'white', p:2, boxShadow:4, maxWidth:'40vw',minWidth:'300px'}}>
                <form onSubmit={Search}>
                <Stack spacing={1}>
               
                    <Dateinputbox labeltext="From" name="startdate" required/>
                    <Dateinputbox labeltext="To" name="Enddate" required/>
                
                <Inputbox labeltext="Attendants" name="attendants"/>
                <Inputbox labeltext="Particulars" name="particulars"/>
                <Inputbox labeltext="Special Remark" name="special remarks"/>
                <Box sx={{display:'flex', justifyContent:"space-between", maxWidth:'100%',minWidth:0}}>
                    <Button variant="contained" onClick={Resetresult} type="reset">Reset</Button>
                    <Box sx={{display:'flex', gap:2}}>
                        <Button variant="contained" onClick={fnPrintPreview}disabled={dataresult === null || dataresult.length === 0}>Print Preview</Button>
                        <Button variant="contained" type="submit" sx={{fontSize:'clamp(10px, 2vw, 14px)', minWidth:'auto', px: 'clamp(12px, 2vw, 16px)',}}>Search</Button>
                    </Box>
                </Box>
                
                </Stack>
                </form>
            </Box>
            <Box sx={{background:'white', boxShadow:4, overflow:'auto',flexShrink:1,minWidth:"150px"}}>
                <DataGrid rows={dataresult} columns={datacolumn} initialState={{pagination:{paginationModel}}} pageSizeOptions={[4]} slotProps={{pagination:{labelRowsPerPage:""}}}/>
            </Box>
        </Box>
        <Box className="hide-it" sx={{display:'flex',minHeight:'29.7cm', justifyContent:'center'}}>
            {dataresult?.length >0 && <PrintPreview datatable={dataresult} reportdata={Criteria}/>}
            
        
        </Box>
        

        </Container>
        </>
    );


}