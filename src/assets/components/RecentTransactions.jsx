import React, { useEffect, useState } from 'react';
import { Card, Badge, Spinner } from 'react-bootstrap';
import { PlusSlashMinus ,ArrowUp } from 'react-bootstrap-icons';
import axios from 'axios';
// import { API_URLS } from '../../../../utils/apiConfig';
import { format } from "date-fns";
import { API_URLS } from '../../../utils/apiConfig';
import { useNavigate } from 'react-router-dom';

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()
  
  useEffect(() => {
    let isMounted = true; // Flag to prevent unnecessary re-renders
  
    const fetchRecentTransactions = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("user"))?.userId;
        if (!userId) return;
  
        const response = await axios.get(API_URLS.getlasttwotrnasaction(userId));
  
        if (!isMounted) return; // Prevent state update if component unmounts
  
        // console.log("API Response:", response.data);
  
        setTransactions(response.data); // Directly set the last two transactions
        setLoading(false);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to fetch recent transactions");
        setLoading(false);
      }
    };
  
    fetchRecentTransactions();
  
    return () => {
      isMounted = false; // Cleanup to prevent unnecessary re-renders
    };
  }, []);
  

  const handleTransactionClick = (transaction) => {
    navigate('/transactiondetails', { state: transaction });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-3">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <p className="text-danger text-center">{error}</p>;
  }



  return (
    <div className="mb-4">
      {transactions.length === 0 ? (
        <p className="text-center text-muted">No recent transactions</p>
      ) : (
        transactions.map((transaction) => (
          <Card className="mb-2" key={transaction._id}
          onClick={() => handleTransactionClick(transaction)}
          style={{ cursor: 'pointer' }}
          >
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                  <ArrowUp className={transaction.amount > 0 ? "text-success" : "text-danger"} size={20} />
                </div>
                <div>
                  <div className="fw-medium" style={{fontSize:"13px"}}>Transfer to {transaction.accountName}</div>
                  <div className="small text-muted" style={{fontSize:"11px"}}>{format(new Date(transaction.createdAt), "MMM do, hh:mm:ss")}</div>
                </div>
              </div>
              <div className="text-end">
                <div className={transaction.amount > 0 ? "text-success fw-medium" : "text-danger fw-medium"}>
                  {transaction.amount > 0 ? `-₦${transaction.amount.toLocaleString()}.00` : `₦${Math.abs(transaction.amount).toLocaleString()}`}
                </div>
                <Badge bg={transaction.status === "successful" ? "success" : transaction.status === "failed" ? "danger" : "warning"}>
                  {transaction.status}
                </Badge>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default RecentTransactions;
