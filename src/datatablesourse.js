    import { Link } from "react-router-dom";
import TabbedPane from "./pages/tabbedpane/TabbedPane";

    export const interfaceColumns = [{ field: 'name', headerName: 'Name', width: 70 },
    
         { field: 'enabled', headerName: 'Enabled', width: 130 },
         { field: 'mtu', headerName: 'MTU', type: 'number', width: 130 },
         { field: 'fec', headerName: 'FEC', type: 'boolean', width: 130 },
         { field: 'oper_sts', headerName: 'Oper_STS',  width: 130 },
         { field: 'speed', headerName: 'Speed', width: 130 },
         { field: 'admin_sts', headerName: 'Admin Status',  width: 130 },
         { field: 'description', headerName: 'Description', width: 130 },
         { field: 'last_chng', headerName: 'Last Change',  width: 130 },
         { field: 'mac_addr', headerName: 'MAC ADDR',  width: 130 },
    
     ];

    
       

     export const portChannelColumns = [{ field: 'lag_name', headerName: 'Lag Name', width: 70 },
         { field: 'active', headerName: 'Active', type: 'boolean', width: 130 },
         { field: 'admin_sts', headerName: 'Admin Status', width: 130 },
         { field: 'mtu', headerName: 'MTU', type: 'number', width: 130 },
         { field: 'name', headerName: 'Name',  width: 130 },
         { field: 'fallback_operational', headerName: 'Fallback Operation', type: 'boolean', width: 130 },
         { field: 'oper_sts', headerName: 'Operation Status',  width: 130 },
         { field: 'speed', headerName: 'Speed', width: 130 },
         { field: 'oper_sts_reason', headerName: 'OperReason',  width: 130 },
         
    
     ];


     export const mclagColumns = [{ field: 'domain_id', headerName: 'Domain_ID', type: 'number', width: 70 },
         { field: 'keepalive_interval', headerName: 'Enabled', type: 'number', width: 130 },
         { field: 'mclag_sys_mac', headerName: 'mclag Delay Restore', width: 130 },
         { field: 'peer_addr', headerName: 'peer address', width: 130 },
         { field: 'peer_link', headerName: 'peer link',  width: 130 },
         { field: 'session_timeout', headerName: 'session timeout', type: 'number', width: 130 },
         { field: 'source_address', headerName: 'Source Address',  width: 130 },
         { field: 'oper_status', headerName: 'Operation Status', width: 130 },
         { field: 'role', headerName: 'Role',  width: 130 },
         { field: 'system_mac', headerName: 'System MAC',  width: 130 },
         { field: 'delay_restore', headerName: 'Delay Restore', type:'number',  width: 130 },

        
     ];
    

    export const deviceUserColumns = [{ field: 'img_name', headerName: 'Image Name', width: 130 },
    { field: 'mgt_intf', headerName: 'Management Int', width: 70 },
    { field: 'mgt_ip', headerName: 'Management IP', width: 70 },
    {
      field: 'hwsku',
      headerName: 'HWSKU',
      type: 'number',
      width: 90,
    },
    

    {
      field: 'mac',
      headerName: 'MAC',
      width: 90,
      // renderCell:(params)=>{
      //   return <div className={`cellWithStatus ${params.row.status}`}> 
      //   {params.row.status}</div>;
    
      // }
    },

    { field: 'platform', headerName: 'PLATFORM', width: 70 },
    { field: 'type', headerName: 'TYPE', width: 70 },
    { field: 'id', headerName: 'ID', width: 70 },

    {field: "action", headerName: "Action", width:200, renderCell:(params)=>{
        return(
          <div className="cellAction">
            { <Link to={`/devices/${params.row.mgt_ip}`} style={{textDecoration: "none"}}>
            <div className="viewButton">View1</div>
            </Link> }
            {/* <button className="viewButton" onClick={()=> <TabbedPane />}>View</button> */}
            
          </div>
        )
      }},

];
    
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
            <div className="viewButton">View2</div>
            </Link>
          </div>
        )
      }},

];

    