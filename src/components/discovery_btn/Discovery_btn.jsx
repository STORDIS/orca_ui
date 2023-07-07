import {Stack } from '@mui/material'
import {LoadingButton} from '@mui/lab'
import axios from 'axios'
import {getDiscoveryUrl} from "../../backend_rest_urls";



const Discovery_btn = () => {

    const btn_click = () => {
         //document.getElementById('btn').disabled= true;
         var btn_value=document.getElementById('btn')
         var new_value= btn_value.disabled=true
         console.log(new_value)
        //  setTimeout (function () {
        //     btn_click()},1000);       
         if (new_value == true) {
                axios('http://localhost:8000/discover')
                .catch(err => console.log(err))
                .then((response) => {
                    const value = (response.data)
                    const res = value.result
                    console.log(res)
                    if(res == "Success") {
                        alert("Network Discovery was successful")
                        document.getElementById('btn').disabled=false
                    }
                    else {
                        alert("Network Discovery failed")
                    }   
                }
                    
                );
                
            }
         
        }   
            
        
            //document.getElementById('btn').disabled= true;
        //<LoadingButton loading variant='outlined'>Discover Network</LoadingButton>
    
  return (
    <Stack spacing={2} direction='row'>
        
        {/* <LoadingButton id='btn' loading variant='outlined'>Discover Network</LoadingButton> */}
        <button id='btn' onClick={btn_click}>Discover Network</button>
    </Stack>
  )
}

export default Discovery_btn