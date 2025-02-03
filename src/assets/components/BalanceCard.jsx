import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { EyeFill, ChevronRight } from 'react-bootstrap-icons';
import '/src/App.css';
import { useNavigate } from 'react-router-dom';

const BalanceCard = () => {
    const navigate = useNavigate()
    const TransactionBtn=()=>{
        navigate("/storetransaction")
    }
    return (
        <Card className="styles bgEmerald text-white p-3 mb-2 rounded-3" style={{marginTop:"57px"}}>

            <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center gap-2">
                    <span className="small">Available Balance</span>
                    <EyeFill size={16} />
                </div>
                <div variant="light" className="text-white" style={{cursor:"pointer"}} onClick={TransactionBtn}>
                Transaction History
                    {/* className="ms-1" */}
                    <ChevronRight className="" />
                </div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
                <span className="fs-4 fw-bold d-flex" style={{alignItems:"center"}}>₦90,701.57 <ChevronRight size={16} /></span>
                <Button variant="light" className="text-success">
                    + Add Money
                </Button>
            </div>
        </Card>
    );
};

export default BalanceCard;

