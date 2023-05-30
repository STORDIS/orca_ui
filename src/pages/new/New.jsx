import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "./new.scss"


const New = () => {
    return(
        <div className='new'>
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>Edit the available configurations</h1>
                </div>
                <div className="bottom">
                    <div className="center">
                        <form>
                            <div className="formInput">
                                <label>name</label>
                                <input type="text" placeholder="Stordis" />
                            </div>
                        
                        
                            <div className="formInput">
                                <label>company name</label>
                                <input type="text" placeholder="broadcom" />
                            </div>
                        
                        
                            <div className="formInput">
                                <label>status</label>
                                <input type="text" placeholder="active" />
                            </div>
                        
                        
                            <div className="formInput">
                                <label>cip</label>
                                <input type="text" placeholder="1587954" />
                            </div>
                            <button>Send</button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default New