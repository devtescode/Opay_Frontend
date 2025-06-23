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
   <div className="container">
  <div className="col-md-6 mx-auto p-4 shadow-lg mt-5 rounded-4 bg-white">
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
          className="form-control border rounded-3 px-3 py-2"
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

    );
};

export default Makepayment



// module.exports.fundaccount = async (req, res) => {
//     const { email, amount } = req.body;
//     try {
//         const user = await Userschema.findOne({ Email: email });

//         if (!user) {
//             return res.status(404).send('User not found');
//         }
//         console.log(user.Fullname);

//         // Create a transaction request with Paystack
//         const response = await axios.post('https://api.paystack.co/transaction/initialize', {
//             email: email,
//             fullname : user.Fullname,
//             phone: user.Number,
//             amount: amount * 100, // Paystack requires the amount in kobo
         
//         }, {
//             headers: {
//                 'Authorization': `Bearer ${process.env.API_SECRET}`,
//                 'Content-Type': 'application/json'
//             }
//         });

//         if (response.data.status) {
//             // If the transaction is successful, redirect the user to the Paystack payment page
//             res.send({
//                 status: true,
//                 message: 'Account funding success',
//                 authorization_url: response.data.data.authorization_url // This URL will take the user to Paystack for payment
//             });
           
            
//             console.log("link response successfully sent");
//         } else {
//             res.status(400).send('Funding failed');
//             console.log("Funding failed");
//         }
//     } catch (error) {
//         console.error('Error funding account', error.response ? error.response.data : error.message);
//         res.status(500).send('Internal server error');
//     }
// };