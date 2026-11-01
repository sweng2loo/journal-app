import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";


export default function PrintPreview({datatable,reportdata}){//component for a A4 format report, due to needing to print, all design use .css 
        const headercolumn = [//column detail and id as identifier for map()
            {id:'DisDate',label:'Date', width: 130 },
            {id:'Particulars',label: 'Particulars', width: 400},
            {id:'Attendants', label:'Attendants', width:100}
        ]
        const startdate = reportdata ? reportdata.startDate.split('T')[0] : ''; // show only the date YYYY-MM-DD, split('T')[0] mean cut the data in half starting from the word 'T' and become data[], [0] is front half, [1] second half of the data
        const enddate = reportdata ? reportdata.endDate.split('T')[0] : '';
        
    return(
        <>
        <Box className="on-paper"> {/*className in javascript is strictly use for css to design the component */}
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
                            <TableRow>{/*map() the header with variable'headers', then loop according to key attribute to create table cell  */}
                                {headercolumn.map((headers)=>(<TableCell className="headers"
                                key={headers.id}
                                >{headers.label}</TableCell>))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {datatable?.map((rows,rowindex)=>( //map() the data from the table received, create row by row
                            /*instead of using map to dynamically assignt the cell accroding to column, we hardcode the 3 table cell because print format is fixed and to keep the code simple */
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