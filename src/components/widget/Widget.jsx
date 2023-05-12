import "./widget.scss"
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Widget = () => {
    return (
        <div className="widget">
            <div className="left">
               <span className="title">Active Devices</span> 
               <span className="counter">IPAM</span>
               <span className="link">Active users</span>
            </div>
            <div className="right">
                <div className="percentage positive">
                    <KeyboardArrowUpIcon/>
                    20%
                </div>
            </div>
        </div>
    )
}

export default Widget