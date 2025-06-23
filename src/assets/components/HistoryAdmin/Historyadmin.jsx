import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URLS } from '../../../../utils/apiConfig';

const Historyadmin = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get(API_URLS.payments); // Update with your actual endpoint
        setPayments(res.data.data);
      } catch (err) {
        console.error("Error fetching payments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="container mt-5">
      <h4 className="fw-bold mb-4">Payment History</h4>
      {loading ? (
        <p>Loading...</p>
      ) : payments.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Reference</th>
                <th>Channel</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={payment._id}>
                  <td>{index + 1}</td>
                  <td>{payment.customerEmail}</td>
                  <td>₦{(payment.amount).toLocaleString()}</td>
                  <td>
                    <span
                      className={`badge ${
                        payment.status === "success"
                          ? "bg-success"
                          : payment.status === "failed"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td>{payment.reference}</td>
                  <td>{payment.channel}</td>
                  <td>{new Date(payment.paidAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No payments found.</p>
      )}
    </div>
  );
};

export default Historyadmin;
