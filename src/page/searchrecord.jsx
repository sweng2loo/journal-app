import { Button, Box, Stack, AppBar, Toolbar, Typography, Container, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper} from "@mui/material";
import Inputbox from "../component/Inputbox";
import Dateinputbox from "../component/Dateinputbox";
import { useState } from "react";




export default function SearchRecord(){
    const tablecolumn = [ // this is the header items, id is for later matching with the body records location
        {id:'no', label:'No', minWidth:10},
        {id:'DisDate', label:'Date', minWidth: 30 },
        {id:'Attendants', label:'Attendants', minWidth: 100 },
        {id:'Particulars', label:'Particulars', minWidth: 200 },
        {id:'SpecialRemark', label:'Special Remark', minWidth: 100 },
        ];
    const [Sresult, Setresult] = useState(null);// use to store the search result table
    const [Squery , Setquery] = useState(null); // use to store the search query criteria for view in detail


       function cancel(){// close the window
        if (window.anyapi){
            window.anyapi.closeChild();
        } else{
            console.log('something wrong!');
        }
    }

        async function Search(e){ // search with input criteria
            e.preventDefault();
            const fdata = new FormData(e.currentTarget);
            const searchcriteria = { // bundle the input into one object for send to main.js
                startDate:fdata.get('startdate'),
                endDate:fdata.get('Enddate'),
                Attendants:fdata.get('attendants'),
                Particulars:fdata.get('particulars'),
                SpecialRemark:fdata.get('specialremarks')
            }
            Setquery(searchcriteria);// save the search criteria
            const result = await window.anyapi.SearchRecord(searchcriteria);//send to main.js through ipcRenderer
            Setresult(result);//save the result table for display purpose
            ;
        }

        function Viewmode(){// use to view the search record detail at /records page
            if (Squery != null){ //check if you have search anything
                if (window.anyapi){
                    window.anyapi.ViewInDetail(Squery);// send the saved search criteria to the /records page to search again for detail viewing 
                }else{console.log('something wrong!')}; 
            }
            else {console.log('you havent search')} // if not then it wont trigger
        }
    

    return(<>
    <AppBar position="static" sx={{marginBottom:4}}>
                    <Toolbar variant="dense" sx={{display:'flex', justifyContent:'center'}}>
                    <Typography variant="h5">Seacrh Records</Typography>
                    </Toolbar>
    </AppBar>
    <Container maxWidth="md" sx={{backgroundColor:'white',p:5}}>
    <Box>

        {/*input search criteria */}
        <form onSubmit={Search}>
        <Stack spacing={2}>
            <Dateinputbox labeltext="Start date" name="startdate"/>
            <Dateinputbox labeltext="End date" name="Enddate"/>
            
    
            <Inputbox labeltext="Attendants" name="attendants"/>
            <Inputbox labeltext="Particular" name="particulars"/>
            <Inputbox labeltext="Special remarks" name="specialremarks"/>

            {/*display the search records in table  */}
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{minHeight:200,maxHeight: 440}}>
                    <Table stickyHeader size="small">
                        {/*create table header */}
                        <TableHead>
                            <TableRow> 
                                {/*using map() create each header table cell and use id as key(identifier like indexnumber of array) to load all*/}
                                {tablecolumn.map((header)=>(<TableCell key={header.id} 
                                style={{
                                    minWidth:header.minWidth, /*access the tablecolumn.minWidth to set each cell width*/
                                    }}
                                    >{header.label /*access the tablecolumn.label to set each label*/}

                                </TableCell>))}
                            </TableRow>
                        </TableHead>
                        {/*load row then each cell of the row to form the data table using double map()*/}
                        <TableBody >
                            {/*load the search result table using map() for each row */}
                            {Sresult?.map((row,rowindex)=>(
                                <TableRow key={rowindex}>
                                 {/*load each row data into respective column using the tablecolumn id declared above */}   
                                {tablecolumn.map((column)=>{ 
                                    const Isindexcolumn = column.id === 'no';/* except the numbering which use rowindex for declared at previous map()*/
                                    return (
                                        <TableCell 
                                        key={column.id} 
                                        sx={{maxWidth:65, overflow:'hidden', whiteSpace:'nowrap',textOverflow:'ellipsis'}}
                                        >{Isindexcolumn ? rowindex + 1 :row[column.id]}
                                        </TableCell>)})}{/*check if this isindexcolumn then use the rowindex as numbering, if not use default mapping data */}
                                </TableRow>))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Box sx={{display:'flex', justifyContent:'space-between', mt:3}}>
            <Button variant="contained" onClick={cancel}>Cancel</Button>

            <Box sx={{display:'flex', gap:2}}>
            <Button variant="contained" onClick={Viewmode}>View in Detail</Button>{/*send the saved search criteria to the /records page to view each record detail  */}   
            <Button variant="contained" type="submit">Submit</Button> {/*submit the input(searchcriteria) to the ipcmain through ipc renderer in preload.js */}
            </Box>
            </Box>


        </Stack>
        </form>
    </Box>
    </Container>    
    </>);
}