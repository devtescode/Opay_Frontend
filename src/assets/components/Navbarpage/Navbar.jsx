import React from 'react'
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
    return (
        <div>
            <nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top">
                <div class="container-fluid text-center">
                    <a class="navbar-brand" style={{cursor:"pointer"}} onClick={HomeBtn}>Admin</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <a class="nav-link active" aria-current="page" style={{cursor:"pointer"}} onClick={HomeBtn}>Home</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" style={{cursor:"pointer"}} onClick={CreateBtn}>Create</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" style={{cursor:"pointer"}} onClick={DetailsBtn}>Details</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" style={{cursor:"pointer"}} onClick={HistoyBtn}>Histoy</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" style={{cursor:"pointer"}} onClick={logoutBtn}>Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar