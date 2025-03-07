import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { EyeFill, EyeSlashFill, ChevronRight } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URLS } from '../../../utils/apiConfig';

const BalanceCard = () => {
    const navigate = useNavigate();
    const [showBalance, setShowBalance] = useState(false);
    const [balance, setBalance] = useState(0);

    const fetchUserBalance = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_URLS.getuserbalance, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBalance(response.data.walletBalance); // Assuming your backend returns walletBalance
        } catch (error) {
            console.error('Failed to fetch balance:', error);
            Swal.fire('Error', 'Failed to fetch balance', 'error');
        }
    };

    useEffect(() => {
        fetchUserBalance();
    }, []);

    const TransactionBtn = () => {
        navigate("/storetransaction");
    };

    const AddMoneyBtn = () => {
        navigate("/addmoney");
    };

    return (
        <Card className="styles bgEmerald text-white p-3 mb-2 rounded-3" style={{ marginTop: "57px" }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center gap-2">
                    <span className="small">Available Balance</span>
                    <span style={{ cursor: "pointer" }} onClick={() => setShowBalance(!showBalance)}>
                        {showBalance ? <EyeFill size={16} /> : <EyeSlashFill size={16} />}
                    </span>
                </div>
                <div className="text-white" style={{ cursor: "pointer" }} onClick={TransactionBtn}>
                    Transaction History <ChevronRight />
                </div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
                <span className="fs-4 fw-bold d-flex" style={{ alignItems: "center" }}>
                    {showBalance ? `₦${balance.toLocaleString()}.00` : "****"}
                </span>
                <Button variant="light" className="text-success" onClick={AddMoneyBtn}>+ Add Money</Button>
            </div>
        </Card>
    );
};

export default BalanceCard;
