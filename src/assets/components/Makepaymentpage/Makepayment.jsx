import { useState } from 'react'
import { useFundAccount } from '../../../hooks/useMutations';
import { useCurrentUser } from '../../../lib/auth';

const Makepayment = () => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const { user } = useCurrentUser();
  const { mutate: fundAccount, isPending: isLoading } = useFundAccount();

  const handlePayment = (e) => {
    e.preventDefault();
    if (!user) return;

    setMessage('');

    fundAccount(
      { username: user.username, amount },
      {
        onSuccess: (data) => {
          if (data?.status) {
            window.location.href = data.authorization_url;
          } else {
            setMessage('Funding failed');
          }
        },
        onError: () => {
          setMessage('Something went wrong while processing payment');
        },
      },
    );
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
                Pay â‚¦300 to gain unlimited transaction access for the day.
              </p>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Amount</label>
              <input
                type="number"
                className="form-control border rounded-1"
                placeholder="â‚¦300"
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