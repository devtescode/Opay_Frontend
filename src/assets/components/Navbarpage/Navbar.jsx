import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate()
    const CreateBtn = ()=>{
        navigate("/createlogin")
    }
    const HomeBtn = ()=>{
        navigate("/admindb")
    }
    const logoutBtn = ()=>{
        navigate("/admin")
        localStorage.removeItem('adminToken');
    }
    const DetailsBtn =()=>{
        navigate("/details")
    }
    const HistoyBtn = ()=>{
        navigate("/historyadmin")
    }
    const FundingBtn =()=>{
        navigate("/funding")
    }
    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
                <div className="container-fluid text-center">
                    <a className="navbar-brand" style={{cursor:"pointer"}} onClick={HomeBtn}>Admin</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" style={{cursor:"pointer"}} onClick={HomeBtn}>Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" style={{cursor:"pointer"}} onClick={CreateBtn}>Create</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" style={{cursor:"pointer"}} onClick={DetailsBtn}>Password</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" style={{cursor:"pointer"}} onClick={HistoyBtn}>Histoy</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" style={{cursor:"pointer"}} onClick={FundingBtn}>Funding</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" style={{cursor:"pointer"}} onClick={logoutBtn}>Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar