import { Button, Box, Stack, AppBar, Toolbar, Typography, Container, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper} from "@mui/material";
import Inputbox from "../component /Inputbox";
import Dateinputbox from "../component /Dateinputbox";
import { useState } from "react";




export default function SearchRecord(){
    const tablecolumn = [
        {id:'no', label:'No', minWidth:10},
        {id:'Date', label:'Date', minWidth: 30 },
        {id:'Attendants', label:'Attendants', minWidth: 100 },
        {id:'Particulars', label:'Particulars', minWidth: 200 },
        {id:'SpecialRemark', label:'Special Remark', minWidth: 100 },
        ];
    const [Sresult, Setresult] = useState(null);


       function cancel(){
        if (window.anyapi){
            window.anyapi.closeChild();
        } else{
            console.log('something wrong!');
        }
        
    }

        async function Search(e){
            e.preventDefault();
            const fdata = new FormData(e.currentTarget);
            const searchcriteria = {
                startDate:fdata.get('startdate'),
                endDate:fdata.get('Enddate'),
                Attendants:fdata.get('attendants'),
                Particulars:fdata.get('particulars'),
                SpecialRemark:fdata.get('specialremarks')
            }

            const result = await window.anyapi.SearchRecord(searchcriteria);
            Setresult(result);
            console.log(result)
            ;
        }
    

    return(<>
    <AppBar position="static" sx={{marginBottom:4}}>
                    <Toolbar variant="dense" sx={{display:'flex', justifyContent:'center'}}>
                    <Typography variant="h5">Seacrh Records</Typography>
                    </Toolbar>
    </AppBar>
    <Container maxWidth="md" sx={{backgroundColor:'white',p:5}}>
    <Box>
        <form onSubmit={Search}>
        <Stack spacing={2}>
            <Dateinputbox labeltext="Start date" name="startdate"/>
            <Dateinputbox labeltext="End date" name="Enddate"/>
            
    
            <Inputbox labeltext="Attendants" name="attendants"/>
            <Inputbox labeltext="Particular" name="particulars"/>
            <Inputbox labeltext="Special remarks" name="specialremarks"/>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{minHeight:200,maxHeight: 440}}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                {tablecolumn.map((header)=>(<TableCell key={header.id} 
                                style={{
                                    minWidth:header.minWidth,
                                    }}
                                    >{header.label}

                                </TableCell>))}
                            </TableRow>
                        </TableHead>
                        <TableBody >
                            {Sresult?.map((row,rowindex)=>(
                                <TableRow key={rowindex}>
                                {tablecolumn.map((column)=>{ 
                                    const Isindexcolumn = column.id === 'no';
                                    return (
                                        <TableCell 
                                        key={column.id} 
                                        sx={{maxWidth:65, overflow:'hidden', whiteSpace:'nowrap',textOverflow:'ellipsis'}}
                                        >{Isindexcolumn ? rowindex + 1 :row[column.id]}
                                        </TableCell>)})}
                                </TableRow>))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Box sx={{display:'flex', justifyContent:'space-between', mt:3}}>
            <Button variant="contained" onClick={cancel}>Cancel</Button>
            <Button variant="contained" type="submit">Submit</Button>
            
            </Box>


        </Stack>
        </form>
    </Box>
    </Container>    
    </>);
}