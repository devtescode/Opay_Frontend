import React, { useEffect, useRef, useState } from 'react';
import { Dropdown, DropdownMenu, Nav, Spinner } from 'react-bootstrap';
import { ArrowLeft, ArrowDown, ArrowUp, Download } from 'react-bootstrap-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URLS } from '../../../../utils/apiConfig';
import { format } from "date-fns";

const StoreTransaction = () => {
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

  // useEffect(() => {
  //   const fetchTransactions = async () => {
  //     try {
  //       const res = await axios.get(API_URLS.getransactions(userId)); // Replace with your actual API
  //       setAllTransactions(res.data);
  //       setFilteredTransactions(res.data); // show all by default
  //     } catch (error) {
  //       console.error("Error fetching transactions", error);
  //     }
  //   };

  //   fetchTransactions();
  // }, []);
  const [load, setLoad] = useState(true);
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(API_URLS.getransactions(userId));
        setAllTransactions(res.data);
        setFilteredTransactions(res.data);
      } catch (error) {
        console.error("Error fetching transactions", error);
      } finally {
        setLoad(false); // stop loading after fetch
      }
    };

    fetchTransactions();
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  // const toggleModal = () => setShowModal(!showModal);
  const toggleModal = () => {
    if (showModal) {
      // modal closing → revert to actual selected values
      setTempMonth(selectedMonth);
      setTempYear(selectedYear);
    }
    setShowModal(!showModal);
  };

  useEffect(() => {
    if (!showModal) return;

    const elMonth = monthRef.current?.querySelector(`[data-value="${tempMonth}"]`);
    const elYear = yearRef.current?.querySelector(`[data-value="${tempYear}"]`);
    elMonth?.scrollIntoView({ behavior: "instant", block: "center" });
    elYear?.scrollIntoView({ behavior: "instant", block: "center" });
  }, [showModal]);

  const now = new Date();
  const currentMonth = now.getMonth() + 1; // JS months are 0-indexed
  const currentYear = now.getFullYear();
  const [tempMonth, setTempMonth] = useState(currentMonth); // for scrolling
  const [tempYear, setTempYear] = useState(currentYear);
  const handleConfirm = () => {
    setSelectedMonth(tempMonth); // apply temp selected values
    setSelectedYear(tempYear);
    setShowModal(false);

    const selectedMonthYear = format(new Date(tempYear, tempMonth - 1), "MMM yyyy");

    const filtered = allTransactions.filter((tx) => {
      const txMonthYear = format(new Date(tx.createdAt), "MMM yyyy");
      return txMonthYear === selectedMonthYear;
    });

    setFilteredTransactions(filtered);
  };


  const months = [...Array(12)].map((_, i) => i + 1); // [1..12]
  const years = [2023, 2024, 2025, 2026];
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const monthItemRefs = useRef([]);
  const yearItemRefs = useRef([]);

  useEffect(() => {
    if (!showModal) return;

    const observeItems = (refsArray, containerRef, setSelected) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.9) {
              const value = Number(entry.target.getAttribute("data-value"));
              if (value) setSelected(value);
            }
          });
        },
        {
          root: containerRef.current,
          threshold: [0.9],
        }
      );

      refsArray.current.forEach((ref) => {
        if (ref) observer.observe(ref);
      });

      return () => {
        refsArray.current.forEach((ref) => {
          if (ref) observer.unobserve(ref);
        });
      };
    };


    const cleanupMonth = observeItems(monthItemRefs, monthRef, setTempMonth);
    const cleanupYear = observeItems(yearItemRefs, yearRef, setTempYear);


    const scrollToSelected = () => {
      const elMonth = monthRef.current?.querySelector(`[data-value="${selectedMonth}"]`);
      const elYear = yearRef.current?.querySelector(`[data-value="${selectedYear}"]`);
      elMonth?.scrollIntoView({ behavior: "instant", block: "center" });
      elYear?.scrollIntoView({ behavior: "instant", block: "center" });
    };

    scrollToSelected();

    return () => {
      cleanupMonth();
      cleanupYear();
    };
  }, [showModal]);

  const pickerStyles = {
    flex: 1,
    height: "120px",
    overflowY: "scroll",
    scrollSnapType: "y mandatory",
    scrollBehavior: "smooth",
    textAlign: "center",
    position: "relative",
    scrollbarWidth: "none", // Firefox
    msOverflowStyle: "none", // IE
  };

  const highlightOverlay = {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: "40px",
    marginTop: "-20px",
    borderTop: "1px solid #E2E2E2",
    borderBottom: "1px solid #E2E2E2",
    pointerEvents: "none",
    zIndex: 1,
  };


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

      <div className="p-3 bg-white">
        <div>
          <div>
            <span>
              {new Date(selectedYear, selectedMonth - 1).toLocaleString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
            <span onClick={toggleModal}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
              <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
            </svg></span>
          </div>

          {/* Modal */}
          {showModal && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 999,
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
              }}
              onClick={toggleModal}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  backgroundColor: "#fff",
                  borderTopLeftRadius: "1.2rem",
                  borderTopRightRadius: "1.2rem",
                  padding: "20px",
                  boxShadow: "0 -4px 12px rgba(0,0,0,0.2)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Tabs */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                  <span style={{ fontWeight: "bold", borderBottom: "2px solid #00c853", paddingBottom: "5px" }}>Month</span>
                  <span style={{ color: "#aaa" }}>Time Frame</span>
                  <span onClick={toggleModal} style={{ fontWeight: "bold", cursor: "pointer" }}>✕</span>
                </div>

                {/* Scroll Pickers */}
                <div style={{ display: "flex", gap: "1rem", marginBottom: "20px", position: "relative" }}>
                  <div style={highlightOverlay} />

                  <div style={pickerStyles} ref={monthRef}>
                    {months.map((month, index) => (
                      <div
                        key={month}
                        data-value={month}
                        ref={(el) => (monthItemRefs.current[index] = el)}
                        style={{
                          scrollSnapAlign: "center",
                          padding: "12px 0",
                          fontSize: "20px",
                          fontWeight: tempMonth === month ? "bold" : "normal",
                          color: tempMonth === month ? "#000" : "#aaa",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setTempMonth(month);
                          monthItemRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }}
                      >
                        {month.toString().padStart(2, "0")}
                      </div>
                    ))}
                  </div>

                  <div style={pickerStyles} ref={yearRef}>
                    {years.map((year, index) => (
                      <div
                        key={year}
                        data-value={year}
                        ref={(el) => (yearItemRefs.current[index] = el)}
                        style={{
                          scrollSnapAlign: "center",
                          padding: "12px 0",
                          fontSize: "20px",
                          fontWeight: selectedYear === year ? "bold" : "normal",
                          color: selectedYear === year ? "#000" : "#aaa",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setSelectedYear(year);
                          yearItemRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }}
                      >
                        {year}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleConfirm}
                  style={{
                    width: "100%",
                    padding: "15px",
                    backgroundColor: "#01B575",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50px",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>


        <div className="text-muted small">
          <span>In: {`₦${(balance * 2).toLocaleString()}.00`}
          </span>
          <span className="ms-3">Out: ₦{moneyOut.toLocaleString()}.00</span>
        </div>
      </div>

      <div className="flex-grow-1 overflow-auto bg-white mt-2">
        {load ? (
          <p className="text-center p-3">Loading transactions...</p>
        ) : filteredTransactions.length === 0 ? (
          <p className="text-center p-3">No transactions available</p>
        ) : (
          filteredTransactions.map((transaction) => {
            const isIncoming = transaction.type === 'incoming';

            return (
              <div
                className="d-flex align-items-center p-3 border-bottom"
                key={transaction._id}
                onClick={() => handleTransactionClick(transaction)}
                style={{ cursor: "pointer" }}
              >
                <div
                  className={`rounded-circle p-2 me-3 ${isIncoming ? "bg-light-red" : "bg-light-green"
                    }`}
                >
                  {isIncoming ? (
                    <ArrowDown className="text-success" />
                  ) : (
                    <ArrowUp className="text-success" />
                  )}
                </div>
                <div className="flex-grow-1">
                  <div
                    className="text-truncate"
                    style={{
                      fontSize: "12px",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    Transfer to {transaction.accountName}
                  </div>
                  <small className="text-muted">
                    {format(new Date(transaction.createdAt), "MMM do, yyyy hh:mm:ss a")}
                  </small>
                </div>

                <div className="text-end text-dark mb-0">
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
                  ) : isIncoming ? (
                    <span>+₦{Math.abs(transaction.amount).toLocaleString()}.00</span>
                  ) : (
                    <span>-₦{Math.abs(transaction.amount).toLocaleString()}.00</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>


      <Nav className="bg-white border-top">
        <div className="d-flex w-100 justify-content-around p-2">
          <div className="text-center text-success">
            <i class="ri-arrow-left-right-line bg-success text-white p-1 rounded-2"></i>
            <div className="small">Transactions</div>
          </div>
          <div className="text-center text-muted">
            {/* <BarChart2 size={24} /> */}
            <i class="ri-pie-chart-line"></i>
            <div className="small text-muted">Statistics</div>
          </div>
        </div>
      </Nav>
    </div >
  );
};

export default StoreTransaction;
