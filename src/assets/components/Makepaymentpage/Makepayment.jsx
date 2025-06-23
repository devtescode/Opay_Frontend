import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { API_URLS } from '../../../../utils/apiConfig';

const Makepayment = () => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getUserFromLocal = JSON.parse(localStorage.getItem('user'));
    // console.log(getUserFromLocal, "gettttttttt");

    if (!getUserFromLocal) {
      alert('User not found, please log in again');
    } else {
      setUser(getUserFromLocal);
    }
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      const response = await axios.post(API_URLS.fundaccount, {
        username: user.username,
        amount: parseInt(amount, 10)
      });

      console.log(response, "get response");


      if (response.data.status) {
        window.location.href = response.data.authorization_url;
      } else {
        setMessage('Funding failed');
      }
    } catch (error) {
      console.error('Error funding account:', error);
      setMessage('Something went wrong while processing payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center px-2"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f0f4f8",
      }}
    >
      <div className="w-100" style={{ maxWidth: "500px" }}>
        <div className="p-3 p-md-4 shadow-lg rounded-4 border border-2 border-light bg-white">
          <form onSubmit={handlePayment}>
            <div className="text-center mb-4">
              <h5 className="fw-bold text-success">Make Payment</h5>
              <p className="text-muted small">
                Pay ₦300 to gain unlimited transaction access for the day.
              </p>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Amount</label>
              <input
                type="number"
                className="form-control border rounded-1"
                placeholder="₦300"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="btn text-white py-2 rounded-5 fw-semibold"
                style={{ backgroundColor: "#01B575", border: "none" }}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Make Payment"}
              </button>
            </div>

            {message && (
              <p className="mt-3 text-danger text-center fw-semibold">{message}</p>
            )}
          </form>
        </div>
      </div>
    </div>

  );
};

export default Makepayment