import axios from "axios";
import { X, Wallet, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { Modal, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { API_URLS } from "../../../../utils/apiConfig";

const Transfermodal = ({ showModal, setShowModal }) => {
  const navigate = useNavigate()
  const [accountData, setAccountData] = useState(null);
  const [amount, setAmount] = useState(null);

  const handleClose = () => {
    setShowModal(false); // Close modal and reset its visibility state
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

  const PaymodelBtn = async () => {
    const savedAccount = JSON.parse(localStorage.getItem('selectedAccount'));
    const savedAmount = parseFloat(localStorage.getItem('transferAmount'));
    const token = localStorage.getItem('token');

    if (!token) {
      Swal.fire('Error', 'User not authenticated', 'error');
      return;
    }

    try {
      setIsLoading(true);

      // Step 1: Fetch Current Wallet Balance
      const balanceResponse = await axios.get(API_URLS.getuserbalance, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const currentBalance = balanceResponse.data.walletBalance;

      if (currentBalance < savedAmount) {
        Swal.fire('Error', 'Insufficient balance', 'error');
        setIsLoading(false);
        return;
      }

      // Step 2: Subtract Amount and Update Balance
      await axios.post(API_URLS.updatebalance, {
        amount: savedAmount
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Step 3: Get User ID
      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData?.userId;

      if (!userId) {
        console.error('No userId found in localStorage');
        return;
      }

      // Step 4: Store Transaction (Including Money Out)
      const transactionData = {
        userId,
        bankName: savedAccount?.bankName,
        accountNumber: savedAccount?.accountNumber,
        accountName: savedAccount?.accountName,
        amount: savedAmount,
      };

      const response = await axios.post(API_URLS.transactions, transactionData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.transactionId) {
        const transaction = response.data; // or construct it manually if needed
        localStorage.setItem("transactionId", transaction.transactionId);

        await axios.post(API_URLS.updatemoneyout, {
          userId,
          amount: savedAmount
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // navigate('/transfersuccess', { state: transaction }); // ✅ Pass transaction here
        navigate('/transfersuccess', {
          state: response.data.transaction,
        });


      } else {
        Swal.fire('Error', 'Transaction failed', 'error');
      }


    } catch (error) {
      console.error('Error processing payment:', error);
      Swal.fire('Error', 'Failed to complete payment', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const [isLoading, setIsLoading] = useState(false); // Track loading stat
  useEffect(() => {
    const savedAccount = localStorage.getItem("selectedAccount");
    if (savedAccount) {
      setAccountData(JSON.parse(savedAccount));
    }

    const savedAmount = localStorage.getItem("transferAmount");
    if (savedAmount) {
      setAmount(parseFloat(savedAmount));
    }
  }, []);

  // If accountData is not yet loaded or is null, show a loading state
  if (!accountData) {
    return (
      <Container fluid>
        <Modal show={showModal} onHide={handleClose} centered style={{ bottom: 0 }}>
          <Modal.Header className="border-bottom">
            <Button variant="link" className="position-absolute end-0 me-3 p-0" onClick={handleClose}>
              <X size={24} />
            </Button>
            <Modal.Title className="w-100 text-center h4 mb-0">Loading...</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">Loading account data...</Modal.Body>
        </Modal>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          margin: 0,
          zIndex: 1050, // Ensure it's on top of other elements
        }}
        backdrop="static"
        className="custom-modal"
      >
        <Modal.Header className="border-bottom">
          <Button variant="link" className="position-absolute me-2 p-0" onClick={handleClose}>
            <X size={18} />
          </Button>
          <Modal.Title className="w-100 text-center h4 mb-0">
            ₦{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4">
          <div className="d-flex flex-column gap-3">
            <div className="d-flex justify-content-between">
              <span className="text-secondary">Bank</span>
              <span className="fw-medium">{accountData.bankName}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-secondary">Account Number</span>
              <span className="fw-medium">{accountData.accountNumber}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-secondary">Name</span>
              <span className="fw-medium">{accountData.accountName}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-secondary">Amount</span>
              <span className="fw-medium">  ₦{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-secondary">Transaction Fee</span>
              <span className="fw-medium">
                <s className="text-secondary me-2">₦10.00</s>
                ₦0.00
              </span>
            </div>

            <div className="pt-4 border-top">
              <div className="d-flex justify-content-between mb-4">
                <span className="fw-medium">Payment method</span>
                <span className="text-secondary">All</span>
              </div>

              <div className="d-flex flex-column gap-3">
                <div className="p-3 bg-light rounded d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    <Wallet size={24} className="text-secondary" />
                    <div>
                      <p className="fw-medium mb-0">Wallet (₦0.00)</p>
                      <p className="text-secondary small mb-0">Insufficient balance</p>
                    </div>
                  </div>
                  <Button variant="link" className="text-success p-0">
                    Add Money
                  </Button>
                </div>

                <div className="p-3 bg-light rounded d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle bg-success-subtle"
                      style={{ width: "24px", height: "24px" }}
                    />
                    <div>
                      <p className="fw-medium mb-0">OWealth</p>
                      <p className="text-secondary mb-0">₦{balance.toLocaleString()}.00</p>
                    </div>
                  </div>
                  <Check size={24} className="text-success" />
                </div>
              </div>
            </div>

            <Button
              disabled={isLoading}
              variant="success"
              style={{ backgroundColor: "#01B575" }}
              className="w-75 py-2 mt-4 mx-auto rounded-5 fs-5 border-0"
              onClick={PaymodelBtn}
            >
              {isLoading ? "Pay" : "Pay"}
            </Button>

          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Transfermodal;
