import { Box, Button, ButtonBase, Container, Fab, Grid, Paper, Typography } from "@mui/material";
import { Link } from "react-router";
import FolderIcon from '@mui/icons-material/Folder';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { useEffect, useState } from "react";
import { CachedRounded, FolderCopyOutlined, SearchOutlined } from "@mui/icons-material";



export default function Home(){
    const [yearlydata, setyearlydata]=useState(null) // store the table which list the year that have records

    //load to check and fetch yearlydata table from database, will use it in useEffect() to load once each time enter the page
    // also use to refresh the table 
    async function loadyearly(){
        const tempyearlydata = await window.anyapi.homepageload();
        setyearlydata(tempyearlydata);
        if(tempyearlydata.length === 0 ){console.log("no record found")};
    }      
    
    // open new window to add new record
    function AddnewRecord(){

        if (window.anyapi){
            window.anyapi.openChild('Entry');
            
        }else{console.log("something wrong");}
        
    };
    function Searchrec(){

        if (window.anyapi){
            window.anyapi.openChild('searchrecord');
            
        }else{console.log("something wrong");}
        
    }



    //main process
    useEffect(()=>{loadyearly()},[]) // passively call function, [] mean call everytime when enter this page

    return(<>
    <Container maxWidth="md" sx={{backgroundColor:'white', p:2 , borderRadius: 10}}>
    <Box sx={{display:'flex', margin:4, justifyContent: 'space-around'}}>
    <Fab color="success" onClick={loadyearly}><CachedRounded/></Fab>
        
    <Fab color="info" onClick={Searchrec}><SearchOutlined/></Fab> {/* later need to add search function which open new window*/}
    </Box>
    {/* the box below is use to make the border fall in with boxShadow, give background checker pattern with backgroundImage and backgroundSize(this is the square size) */}
    <Box sx={{minHeight:'60vh',minWidth:'95%', border:'1px', p:2, boxShadow:'inset 4px 4px 0px 4px rgba(0, 0, 0, 0.06)',borderRadius:4,  backgroundImage: 'repeating-conic-gradient(	#ffffff 0% 25%, #86fa82 25% 50%)', backgroundSize: '70px 70px'}}>
        <Grid container spacing={3}>

            {/* the add new record button built with buttonbase and paper component */}
            <Grid size={{ xs: 6, sm: 4, md: 2 }} sx={{borderRadius:2 }}>
                <ButtonBase onClick={AddnewRecord} sx={{width: '100%', display:'block', borderRadius:2}}>
                    <Paper elevation={5} 
                    sx={{aspectRatio:1/1, display:'flex', flexDirection:"column", justifyContent:'center', alignItems:'center' 
                    }}>
                        <NoteAddIcon sx={{width:"50%", height:"50%"}}/>
                        <Typography variant="body1" sx={{
                        fontSize: '15px',
                        width: "100%",
                        lineHeight:1.2, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        whiteSpace:'nowrap'}} >New record</Typography>
                    </Paper>
                </ButtonBase>
            </Grid>
            
            {/* the button that go to records page built with buttonbase and paper component */}
            <Grid size={{ xs: 6, sm: 4, md: 2 }} sx={{borderRadius:2 }}>
                <ButtonBase component={Link} to="/records" sx={{width: '100%', display:'block', borderRadius:2}}>
                    <Paper elevation={5} 
                    sx={{aspectRatio:1/1, display:'flex', flexDirection:"column", justifyContent:'center', alignItems:'center' 
                    }}>
                        <FolderCopyOutlined sx={{width:"50%", height:"50%"}}/>
                        <Typography variant="body1" sx={{
                        fontSize: '15px',
                        width: "100%",
                        textAlign:'center',
                        lineHeight:1.2, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        whiteSpace:'nowrap'}} >All records</Typography>
                    </Paper>
                </ButtonBase>
            </Grid>
            <Grid size={12}/>
            {/* check of there is yearlydata table have any data, then map the yearlydata(object array). map() give the object name of yearitem,then send out according to index variable*/}
            {/* it will have muliple same component after using map() */}
            {yearlydata?.map((yearitem,index)=>(
                <Grid size={{ xs: 6, sm: 4, md: 2 }} sx={{borderRadius:2 }} key={index}>{/*the key attribute allow the change of data within this html component*/}
                <ButtonBase component={Link} to={`/records/${yearitem.year}`} sx={{width: '100%', display:'block', borderRadius:2}}>
                                                            {/*this is object.key, the ${}allow input variable inside the `` string   */}
                    <Paper elevation={5} 
                    sx={{aspectRatio:1/1, display:'flex', flexDirection:"column", justifyContent:'center', alignItems:'center' 
                    }}>
                        <FolderIcon sx={{width:"50%", height:"50%"}}/>
                        <Typography variant="body1" sx={{
                        fontSize: '15px',
                        width: "100%",
                        textAlign:'center',
                        lineHeight:1.2, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        whiteSpace:'nowrap'}} >{yearitem.year}</Typography>
                    </Paper>
                </ButtonBase>
            </Grid>
            ))}
            
            
            
            

        </Grid>
        
    </Box>
    
    
    
    
    
    </Container>
    
    </>);
}