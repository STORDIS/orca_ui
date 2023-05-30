    import { Link } from "react-router-dom";
    
    export const userColumns = [{ field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Device Name', width: 130 },
    { field: 'company', headerName: 'Company name', width: 130 },
    {
      field: 'ports',
      headerName: 'Ports',
      type: 'number',
      width: 90,
    },
    

    {
      field: 'status',
      headerName: 'Device Status',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      renderCell:(params)=>{
        return <div className={`cellWithStatus ${params.row.status}`}> 
        {params.row.status}</div>;
    
      }
    },

    {field: "action", headerName: "Action", width:200, renderCell:()=>{
        return(
          <div className="cellAction">
            <Link to="/devices/1" style={{textDecoration: "none"}}>
            <div className="viewButton">View</div>
            </Link>

            <Link to="/devices/1" style={{textDecoration: "none"}}>
            <div className="editButton">Edit</div>
            </Link>
          </div>
        )
      }},

];
    
    
    export const userRows = [
        {
            id: 1,
            name: "Sonic 1",
            ports: 5,
            company: "broadcom",
            status: "Active"
        },

        {
            id: 2,
            name: "Sonic 2",
            ports: 1,
            company: "edgecore",
            status: "Deactive"
        },

        {
            id: 3,
            name: "Sonic 3",
            ports: 4,
            company: "broadcom",
            status: "Active"
        },

        {
            id: 4,
            name: "Sonic 4",
            ports: 2,
            company: "edgecore",
            status: "Active"
        }
    ]