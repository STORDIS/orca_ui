import "./table.scss";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const List = () => {

    const rows = [
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
    return(
        <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">id</TableCell>
            <TableCell className="tableCell">name</TableCell>
            <TableCell className="tableCell">ports</TableCell>
            <TableCell className="tableCell">company</TableCell>
            <TableCell className="tableCell">status</TableCell>
            <TableCell className="tableCell">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
            >
              <TableCell className="tableCell">{row.id}</TableCell>
              <TableCell className="tableCell">{row.name}</TableCell>
              <TableCell className="tableCell">{row.ports}</TableCell>
              <TableCell className="tableCell">{row.company}</TableCell>
              <TableCell className="tableCell">
                <span className={`status ${row.status}`}>{row.status}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    )
}

export default List