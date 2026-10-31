import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";


export default function PrintPreview({datatable,reportdata}){
        const headercolumn = [
            {id:'DisDate',label:'Date', width: 130 },
            {id:'Particulars',label: 'Particulars', width: 400},
            {id:'Attendants', label:'Attendants', width:100}
        ]
        const startdate = reportdata ? reportdata.startDate.split('T')[0] : '';
        const enddate = reportdata ? reportdata.endDate.split('T')[0] : '';
        
    return(
        <>
        <Box className="on-paper">
            <Box className="title">
                <Typography className="titlelabel" variant="h4"> Journal Report</Typography>
            </Box>
            <Box className="reportdata" >
                    <Typography variant="h6" className="reportdata">Duration: {startdate} ~ {enddate}</Typography>
                    <Typography variant="h6" className="reportdata">Remark: </Typography>
            </Box>
            <Box>
                <TableContainer>
                    <Table className="table">
                        <TableHead>
                            <TableRow>
                                {headercolumn.map((headers)=>(<TableCell className="headers"
                                key={headers.id}
                                >{headers.label}</TableCell>))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {datatable?.map((rows,rowindex)=>(
                                <TableRow className="row-data" key={rowindex}>
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
                <Box className="Endnote">
                    <Typography className="Endlabel">End of Records</Typography>
                </Box>
                
            </Box>
            

        </Box>
        
        </>
    );
}