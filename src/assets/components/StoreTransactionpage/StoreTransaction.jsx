import React, { useEffect, useState } from 'react';
import { Dropdown, Nav, Spinner } from 'react-bootstrap';
import { ArrowLeft, ArrowDown, ArrowUp, Download } from 'react-bootstrap-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URLS } from '../../../../utils/apiConfig';
import { format } from "date-fns";

const StoreTransaction = ({ transactionStatus }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('user')).userId;
        const response = await axios.get(API_URLS.getransactions(userId));
        setTransactions(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching transaction history:', err);
        setError('Failed to fetch transactions');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);


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



  // useEffect(() => {
  //   const fetchTransactions = async () => {
  //     try {
  //       const user = JSON.parse(localStorage.getItem("user"));
  //       const userId = user?.userId;
  //       const response = await axios.get(API_URLS.getransactions(userId));
  //       const fetchedTransactions = response.data;

  //       // Handle failed → reversed after 20s in UI
  //       const updatedTransactions = fetchedTransactions.map((transaction) => {
  //         if (transaction.status === "failed") {
  //           // Set a timer to change the status in UI
  //           setTimeout(() => {
  //             setTransactions((prev) =>
  //               prev.map((t) =>
  //                 t._id === transaction._id
  //                   ? { ...t, status: "Reversed" }
  //                   : t
  //               )
  //             );
  //           }, 20000); // 20 seconds
  //         }
  //         return transaction;
  //       });

  //       setTransactions(updatedTransactions);
  //       setLoading(false);
  //     } catch (err) {
  //       console.error("Error fetching transaction history:", err);
  //       setError("Failed to fetch transactions");
  //       setLoading(false);
  //     }
  //   };

  //   fetchTransactions();
  // }, []);

  const TranferBtnBack = () => {
    navigate("/userdb")
  }

  const handleTransactionClick = (transaction) => {
    navigate('/transactiondetails', { state: transaction });
  };


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


  const [moneyOut, setMoneyOut] = useState(0);
  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.userId;

  useEffect(() => {
    const fetchMoneyOut = async () => {
      try {
        const response = await axios.get(API_URLS.getMoneyOut(userId), {
          headers: { Authorization: `Bearer ${token}` }
        });

        setMoneyOut(response.data.moneyOut !== undefined ? response.data.moneyOut : 0);
      } catch (error) {
        console.error('Error fetching money out:', error);
      }
    };

    if (userId) {
      fetchMoneyOut();
    }
  }, [userId, token]);



  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
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
    <div className="container-fluid bg-light d-flex flex-column vh-100 ">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center p-3 bg-white">
        <div className="d-flex align-items-center">
          <ArrowLeft className="me-3" size={20} onClick={TranferBtnBack} />
          <h5 className="mb-0">Transactions</h5>
        </div>
        <Download className="text-success" size={20} />
      </div>

      {/* Filters */}
      <div className="d-flex gap-2 p-3">
        <Dropdown className="flex-grow-1">
          <Dropdown.Toggle variant="light" className="w-100 text-start bg-white">
            All Categories
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>All Categories</Dropdown.Item>
            <Dropdown.Item>Transfers</Dropdown.Item>
            <Dropdown.Item>Interest</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown className="flex-grow-1">
          <Dropdown.Toggle variant="light" className="w-100 text-start bg-white">
            All Status
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>All Status</Dropdown.Item>
            <Dropdown.Item>Successful</Dropdown.Item>
            <Dropdown.Item>Failed</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Transaction Period */}
      <div className="p-3 bg-white">
        <h6>{new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' })}</h6>

        <div className="text-muted small">
          <span>In: {`₦${(balance * 2).toLocaleString()}.00`}
          </span>
          <span className="ms-3">Out: ₦{moneyOut.toLocaleString()}.00</span>
        </div>
      </div>

      {/* Transactions List */}
      <div className="flex-grow-1 overflow-auto bg-white mt-2">
        {transactions.length === 0 ? (
          <p className="text-center p-3">No transactions available</p>
        ) : (
          transactions.map((transaction) => (
            <div className="d-flex align-items-center p-3 border-bottom" key={transaction._id}
              onClick={() => handleTransactionClick(transaction)}
              style={{ cursor: 'pointer' }}
            >
              <div
                className={`rounded-circle p-2 me-3 ${transaction.amount > 0 ? 'bg-light-green' : 'bg-light-red'
                  }`}
              >
                {transaction.amount > 0 ? (
                  <ArrowUp className="text-success" />
                ) : (
                  <ArrowDown className="text-danger" />
                )}
              </div>
              <div className="flex-grow-1">
                <div className="text-truncate" style={{ fontSize: "12px", whiteSpace: "normal", wordBreak: "break-word" }}>Transfer to {transaction.accountName}</div>
                <small className="text-muted">
                  {/* {new Date(transaction.createdAt).toLocaleString()} */}
                  {format(new Date(transaction.createdAt), "MMM do, yyyy hh:mm:ss a")}
                </small>
              </div>
              {/* <div className="text-end text-dark">
                -₦{Math.abs(transaction.amount).toLocaleString()}.00
                <div
                  className={`small ${transaction.status === "pending"
                    ? "text-warning"
                    : transaction.status === "failed"
                      ? "text-danger"
                      : "text-success"
                    }`}
                >
                  {transaction.status}
                </div>

              </div> */}
              <div key={transaction._id} className="text-end text-dark mb-0">
                <div
                  className={`small ${transaction.status === "pending"
                      ? "text-warning"
                      : transaction.status === "failed"
                        ? "text-danger"
                        : transaction.status === "Reversed"
                          ? "text-warning"
                          : "text-success"
                    }`}
                >
                  {transaction.status}
                </div>
                {transaction.status === "Reversed" ? (
                  <span>+₦{Math.abs(transaction.amount).toLocaleString()}.00</span>
                ) : (
                  <span>-₦{Math.abs(transaction.amount).toLocaleString()}.00</span>
                )}
              </div>

            </div>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <Nav className="bg-white border-top">
        <div className="d-flex w-100 justify-content-around p-2">
          <div className="text-center text-success">
            {/* <ArrowDown size={24} /> */}
            {/* <div className='border'> */}
            <i class="ri-arrow-left-right-line bg-success text-white p-1 rounded-2"></i>
            {/* </div> */}
            <div className="small">Transactions</div>
          </div>
          <div className="text-center text-muted">
            {/* <BarChart2 size={24} /> */}
            <i class="ri-pie-chart-line"></i>
            <div className="small text-muted">Statistics</div>
          </div>
        </div>
      </Nav>
    </div>
  );
};

export default StoreTransaction;
