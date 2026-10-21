import { useState } from 'react';
import Data from '../Data.json'; // Bank list
import { useNavigate } from 'react-router-dom';
import { useAddMoney } from '../../../hooks/useMutations';
import { getErrorMessage } from '../../../lib/apiClient';
import { alert } from '../../../lib/alert';

const Addmoney = () => {
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [bankName, setBankName] = useState('');

  const navigate = useNavigate();
  const { mutate: addMoney, isPending: isLoading } = useAddMoney();

  const handleBankChange = (e) => {
    const selectedCode = e.target.value;
    const selectedBank = Data.banks.find((bank) => bank.code === selectedCode);
    if (selectedBank) {
      setBankCode(selectedBank.code);
      setBankName(selectedBank.name);
    }
  };

  const handleAddMoney = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert.error('Error', 'Please enter a valid amount');
      return;
    }

    if (!accountNumber || !bankCode || !bankName) {
      alert.error('Error', 'All bank details are required');
      return;
    }

    addMoney(
      { amount: Number(amount), accountNumber, bankCode, bankName },
      {
        onSuccess: () => {
          setAmount('');
          setAccountNumber('');
          setBankCode('');
          setBankName('');
          navigate('/userdb');
        },
        onError: (error) => {
          alert.error('Error', getErrorMessage(error, 'Failed to add money'));
        },
      },
    );
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4 rounded" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center text-primary mb-4">Add Money</h2>

        <input
          type="number"
          className="form-control mb-3"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />

        <select
          className="form-select mb-3"
          value={bankCode}
          onChange={handleBankChange}
        >
          <option value="">Select Bank</option>
          {Data.banks.map((bank) => (
            <option key={bank.code} value={bank.code}>
              {bank.name}
            </option>
          ))}
        </select>

        <button
          className="btn btn-primary w-50 mx-auto"
          onClick={handleAddMoney}
          disabled={isLoading}
        >
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            'Submit'
          )}
        </button>
      </div>
    </div>
  );
};

export default Addmoney;

