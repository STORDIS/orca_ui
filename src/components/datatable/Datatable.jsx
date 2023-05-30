import "./datatable.scss"
import { DataGrid } from '@mui/x-data-grid';
import { userRows, userColumns } from "../../datatablesourse";


const Datatable = () => {

  
    return (
        <div className="datatable">
            <DataGrid
                rows={userRows}
                columns={userColumns}
                pageSize= {5}
                rowsPerPageOptions= {[5]}
                checkboxSelection
        
            />
        </div>
    )
}

export default Datatable