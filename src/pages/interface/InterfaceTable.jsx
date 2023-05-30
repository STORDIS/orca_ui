import "./interface.scss"
//import { DataGrid } from '@mui/x-data-grid';
// //import { userRows, userColumns } from "../../datatablesourse";
import React from "react";

// const userColumns = [{ field: 'name', headerName: 'Name', width: 70 },
//     { field: 'enabled', headerName: 'Enabled', width: 130 },
//     { field: 'mtu', headerName: 'MTU', type: 'number', width: 130 },
//     { field: 'fec', headerName: 'FEC', type: 'boolean', width: 130 },
//     { field: 'spsts', headerName: 'Oper_STS',  width: 130 },
//     { field: 'admin_eed', headerName: 'Speed', width: 130 },
//     { field: 'oper_sts', headerName: 'Admin Status',  width: 130 },
//     { field: 'description', headerName: 'Description', width: 130 },
//     { field: 'last_chng', headerName: 'Last Change',  width: 130 },
//     { field: 'mac_addr', headerName: 'MAC ADDR',  width: 130 },
    

// ];

const InterfaceTable = ({data, column}) => {
    return(
        <table>
            <thead>
                <tr>
                    {column.map((item,index) => <TableHeadItem item={item}/>)}
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => <TableRow item={item} column={column}/>)}
            </tbody>
        </table>
    )
}

const TableHeadItem = ({ item }) => <th>{item.heading}</th>
const TableRow = ({item, column}) => (
    <tr>
        {column.map((columnItem, index) => {
            return <td>{item[`${columnItem.value}`]}</td>
        })}
    </tr>
)


// const InterfaceTable = () => {

  
//     return (
//         <div className="interfaceDatatable">
//             <DataGrid
//                 //rows={userRows}
//                 columns={userColumns}
//                 pageSize= {5}
//                 rowsPerPageOptions= {[5]}
//                 checkboxSelection
        
//             />
//         </div>
//     )
// }

 export default InterfaceTable