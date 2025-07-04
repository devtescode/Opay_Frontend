// import React, { useEffect, useState } from "react";
// import { Card, Badge, Spinner } from "react-bootstrap";
// import { ArrowUp } from "react-bootstrap-icons";
// import axios from "axios";
// import { format } from "date-fns";
// import { API_URLS } from "../../../utils/apiConfig";
// import { useNavigate } from "react-router-dom";

// const RecentTransactions = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   useEffect(() => {
//     // Only run if transactions are loaded
//     transactions.forEach((transaction) => {
//       if (transaction.status === "pending") {
//         setTimeout(async () => {
//           try {
//             const res = await axios.put(
//               API_URLS.reverseTransaction(transaction._id)
//             );

//             setTransactions((prev) =>
//               prev.map((t) =>
//                 t._id === transaction._id
//                   ? { ...t, status: "Reversed" }
//                   : t
//               )
//             );
//           } catch (err) {
//             console.error("Error reversing transaction:", err);
//           }
//         }, 20000);
//       }
//     });
//   }, [transactions]); // Run this effect when transactions change


//   useEffect(() => {
//     let isMounted = true;

//     const fetchRecentTransactions = async () => {
//       try {
//         const userId = JSON.parse(localStorage.getItem("user"))?.userId;
//         if (!userId) return;

//         const response = await axios.get(API_URLS.getlasttwotrnasaction(userId));

//         if (!isMounted) return;

//         setTransactions(response.data);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching transactions:", err);
//         setError("Failed to fetch recent transactions");
//         setLoading(false);
//       }
//     };

//     fetchRecentTransactions();

//     return () => {
//       isMounted = false;
//     };
//   }, []);




//   const handleTransactionClick = (transaction) => {
//     navigate("/transactiondetails", { state: transaction });
//   };

//   // if (loading) {
//   //   return (
//   //     <div className="d-flex justify-content-center align-items-center p-3">
//   //       <Spinner animation="border" role="status" variant="primary">
//   //         <span className="visually-hidden">Loading...</span>
//   //       </Spinner>
//   //     </div>
//   //   );
//   // }
//   if (loading) {
//     return null; // Don't show anything while loading
//   }

//   if (error) {
//     return <p className="text-danger text-center">{error}</p>;
//   }

//   return (
//     <div className="mb-4">
//       {transactions.length === 0 ? (
//         <p className="text-center text-muted">No recent transactions</p>
//       ) : (
//         <div className="mb-2 bg-white rounded-3 p-2" style={{ cursor: "pointer" }}>
//           {transactions.map((transaction) => (
//             <div
//               key={transaction._id}
//               onClick={() => handleTransactionClick(transaction)}
//               className="d-flex align-items-center justify-content-between mb-2"
//             >
//               <div className="d-flex align-items-center gap-2">
//                 <div
//                   className="rounded-circle bg-light d-flex align-items-center justify-content-center"
//                   style={{ width: 40, height: 40 }}
//                 >
//                   <ArrowUp
//                     className={
//                       transaction.amount > 0 ? "text-success" : "text-danger"
//                     }
//                     size={20}
//                   />
//                 </div>
//                 <div>
//                   <div className="fw-medium" style={{ fontSize: "15px" }}>
//                     Transfer to {transaction.accountName}
//                   </div>
//                   <div
//                     className="small text-muted"
//                     style={{ fontSize: "11px" }}
//                   >
//                     {format(
//                       new Date(transaction.createdAt),
//                       "MMM do, hh:mm:ss"
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Right side */}



//               <div className="text-end">
//                 <div
//                   className={`fw-medium ${transaction.status === "Reversed"
//                     ? "" // No color class for Reversed = default black
//                     : transaction.amount > 0
//                       ? ""
//                       : ""
//                     }`}
//                 >
//                   {transaction.status === "Reversed"
//                     ? `+₦${Math.abs(transaction.amount).toLocaleString()}.00`
//                     : transaction.amount > 0
//                       ? `-₦${transaction.amount.toLocaleString()}.00`
//                       : `₦${Math.abs(transaction.amount).toLocaleString()}.00`}
//                 </div>

//                 <div
//                   className="rounded-1 px-1 text-center"
//                   style={{
//                     backgroundColor:
//                       transaction.status === "successful"
//                         ? "#CAFBF0"
//                         : transaction.status === "failed"
//                           ? "#F8D7DA" // Light red for failed
//                           : transaction.status === "Reversed"
//                             ? "#FFF3CD" // Light yellow for reversed
//                             : "#FFF3CD", // Default fallback (same as warning)
//                     color:
//                       transaction.status === "successful"
//                         ? "#52C59D"
//                         : transaction.status === "failed"
//                           ? "#842029" // Dark red text for failed
//                           : transaction.status === "Reversed"
//                             ? "#664d03" // Dark yellow text for reversed
//                             : "#664d03", // Default fallback
//                   }}
//                 >
//                   {transaction.status}
//                 </div>




//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>

//   );
// };

// export default RecentTransactions;
import React, { useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "react-bootstrap-icons";
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
    // Reverse pending transactions after 20 seconds
    transactions.forEach((transaction) => {
      if (transaction.status === "pending") {
        setTimeout(async () => {
          try {
            const res = await axios.put(
              API_URLS.reverseTransaction(transaction._id)
            );

            setTransactions((prev) =>
              prev.map((t) =>
                t._id === transaction._id ? { ...t, status: "Reversed" } : t
              )
            );
          } catch (err) {
            console.error("Error reversing transaction:", err);
          }
        }, 20000);
      }
    });
  }, [transactions]);

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
    return null; // Don't show anything while loading
  }
  if (error) {
    return <p className="text-danger text-center">{error}</p>;
  }

  return (
    <div className="mb-4 bg-white rounded-3">
      {transactions.length === 0 ? (
        <p className="text-center p-3">No transactions available</p>
      ) : (
        transactions.map((transaction) => {
          const isIncoming = transaction.type === "incoming";

          return (
            <div
              className="d-flex align-items-center p-2"
              key={transaction._id}
              onClick={() => handleTransactionClick(transaction)}
              style={{ cursor: "pointer" }}
            >
              <div
                className={`p-2 me-2 d-flex mx-auto justify-content-center text-center align-items-center`}
                style={{ backgroundColor: "#ECFBF6", borderRadius: "1000px", height: "35px", width: "35px" }}
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
             
                  <div className="fw-medium" style={{ fontSize: "14.4px" }}>
                    {isIncoming ? "Transfer from" : "Transfer to"} {transaction.accountName}
                  </div>

                </div>
                <small className="text-muted">
                  {format(new Date(transaction.createdAt), "MMM do, yyyy hh:mm:ss a")}
                </small>
              </div>

              <div className="text-end text-dark mb-0">

                {transaction.status === "Reversed" ? (
                  <span>+₦{Math.abs(transaction.amount).toLocaleString()}.00</span>
                ) : isIncoming ? (
                  <span className="fw-medium" style={{ color: "#1FAB7C" }}>+₦{Math.abs(transaction.amount).toLocaleString()}.00</span>
                ) : (
                  <span className="fw-medium">-₦{Math.abs(transaction.amount).toLocaleString()}.00</span>
                )}
                <div
                  className="rounded-1 px-1 text-center"
                  style={{
                    backgroundColor:
                      transaction.status === "successful"
                        ? "#CAFBF0"
                        : transaction.status === "failed"
                          ? "#F8D7DA" // Light red for failed
                          : transaction.status === "Reversed"
                            ? "#FFF3CD" // Light yellow for reversed
                            : "#FFF3CD", // Default fallback (same as warning)
                    color:
                      transaction.status === "successful"
                        ? "#52C59D"
                        : transaction.status === "failed"
                          ? "#842029" // Dark red text for failed
                          : transaction.status === "Reversed"
                            ? "#664d03" // Dark yellow text for reversed
                            : "#664d03", // Default fallback
                  }}
                >
                  {transaction.status}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default RecentTransactions;

