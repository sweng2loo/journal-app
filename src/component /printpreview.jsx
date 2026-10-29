import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from "react";

export default function PrintPreview({datatable,reportdata}){
        const headercolumn = [
            {id:'DisDate',label:'Date', width: 130 },
            {id:'Particulars',label: 'Particulars', width: 400},
            {id:'Attendants', label:'Attendants', width:100}
        ]
        const startdate = reportdata.startDate.split('T')[0];
        const enddate = reportdata.endDate.split('T')[0];
        
    return(
        <>
        <Box sx={{display:'flex', flexDirection:'column', background:"white", height:"29.7cm", width:'21cm',p:15,overflow:'auto'}}>
            <Box sx={{display:"flex", justifyContent:'center'}}>
                <Typography variant="h4" sx={{fontSize:'50px', fontWeight:'bold'}}> Journal Report</Typography></Box>
            <Box>
                <Box sx={{display:'flex', justifyContent:'space-between', mt:10, mb:2}}>
                    <Typography variant="h6" sx={{fontSize:'16px'}}>Duration: {startdate} ~ {enddate}</Typography>
                    <Typography variant="h6" sx={{fontSize:'16px'}}>Remark: </Typography>
                </Box>
            </Box>
            <Box>
                <TableContainer>
                    <Table sx={{borderTop:'1px solid black', borderRight:'1px solid black'}}>
                        <TableHead sx={{height: '5px'}}>
                            <TableRow>
                                {headercolumn.map((headers)=>(<TableCell 
                                key={headers.id}
                                sx={{
                                    borderLeft:'1px solid black', 
                                    borderBottom:'1px solid black',
                                    width: headers.width,
                                    p:0.5,
                                    fontWeight:'bold',
                                }}
                                >{headers.label}</TableCell>))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {datatable?.map((rows,rowindex)=>(
                                <TableRow key={rowindex}>
                                    <TableCell className="celldata" >{rows.DisDate}
                                    </TableCell>
                                    <TableCell className="celldata" >
                                        <Box >{rows.Particulars}</Box>
                                        {rows.imgpath && <Box component="img" src={`image://${rows.imgpath}`} alt="" sx={{height:'160px', width:'240px', objectFit:'cover'}}/>}
                                        <Box className="sp-remark">Sp remark:  {rows.SpecialRemark}</Box>
                                    </TableCell>
                                    <TableCell className="celldata">
                                        {rows.Attendants}
                                    </TableCell>
                                </TableRow> ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{display:'flex',justifyContent:'center'}}><Typography sx={{fontSize:'20px', mt:2}}>End of Records</Typography></Box>
                
            </Box>
            

        </Box>
        
        </>
    );
}