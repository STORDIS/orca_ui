import { Stack } from '@mui/material'
import axios from 'axios'
import {getDiscoveryUrl} from '../../backend_rest_urls'



const Discovery = () => {
    const btn_click = () => {
        var btn_value = document.getElementById('btn')
        var new_value = btn_value.disabled = true
        console.log(new_value)
        if (new_value == true) {
            axios(getDiscoveryUrl())
                .catch(err => console.log(err))
                .then((response) => {
                    const value = (response.data)
                    const res = value.result
                    console.log(res)
                    if (res == "Success") {
                        alert("Network Discovery was successful")
                        document.getElementById('btn').disabled = false
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

export default Discovery