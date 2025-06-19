import React, { useEffect, useState } from "react";
import { Card, Badge, Spinner } from "react-bootstrap";
import { ArrowUp } from "react-bootstrap-icons";
import axios from "axios";
import { format } from "date-fns";
import { API_URLS } from "../../../utils/apiConfig";
import { useNavigate } from "react-router-dom";

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    // Only run if transactions are loaded
    transactions.forEach((transaction) => {
      if (transaction.status === "pending") {
        setTimeout(async () => {
          try {
            const res = await axios.put(
              API_URLS.reverseTransaction(transaction._id)
            );

            setTransactions((prev) =>
              prev.map((t) =>
                t._id === transaction._id
                  ? { ...t, status: "Reversed" }
                  : t
              )
            );
          } catch (err) {
            console.error("Error reversing transaction:", err);
          }
        }, 20000);
      }
    });
  }, [transactions]); // Run this effect when transactions change


  useEffect(() => {
    let isMounted = true;

    const fetchRecentTransactions = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("user"))?.userId;
        if (!userId) return;

        const response = await axios.get(API_URLS.getlasttwotrnasaction(userId));

        if (!isMounted) return;

        setTransactions(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to fetch recent transactions");
        setLoading(false);
      }
    };

    fetchRecentTransactions();

    return () => {
      isMounted = false;
    };
  }, []);




  const handleTransactionClick = (transaction) => {
    navigate("/transactiondetails", { state: transaction });
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
        <div className="mb-2 bg-white rounded-3 p-2" style={{ cursor: "pointer" }}>
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              onClick={() => handleTransactionClick(transaction)}
              className="d-flex align-items-center justify-content-between mb-2"
            >
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                  style={{ width: 40, height: 40 }}
                >
                  <ArrowUp
                    className={
                      transaction.amount > 0 ? "text-success" : "text-danger"
                    }
                    size={20}
                  />
                </div>
                <div>
                  <div className="fw-medium" style={{ fontSize: "15px" }}>
                    Transfer to {transaction.accountName}
                  </div>
                  <div
                    className="small text-muted"
                    style={{ fontSize: "11px" }}
                  >
                    {format(
                      new Date(transaction.createdAt),
                      "MMM do, hh:mm:ss"
                    )}
                  </div>
                </div>
              </div>

              {/* Right side */}



              <div className="text-end">
                <div
                  className={`fw-medium ${transaction.status === "Reversed"
                    ? "" // No color class for Reversed = default black
                    : transaction.amount > 0
                      ? ""
                      : ""
                    }`}
                >
                  {transaction.status === "Reversed"
                    ? `+₦${Math.abs(transaction.amount).toLocaleString()}.00`
                    : transaction.amount > 0
                      ? `-₦${transaction.amount.toLocaleString()}.00`
                      : `₦${Math.abs(transaction.amount).toLocaleString()}.00`}
                </div>

                <div
                className="rounded-1 px-1"
                  style={
                    transaction.status === "successful"
                      ? {
                        backgroundColor: "#CAFBF0",
                        color: "#52C59D",
    
                      }
                      : {}
                  }
                  bg={
                    transaction.status === "successful"
                      ? undefined
                      : transaction.status === "failed"
                        ? "danger"
                        : transaction.status === "Reversed"
                          ? "warning"
                          : "warning"
                  }
                >
                  {transaction.status}
                </div>



              </div>
            </div>
          ))}
        </div>
      )}
    </div>

  );
};

export default RecentTransactions;
