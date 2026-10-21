import { X, Check, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Modal, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getBankLogoByName } from '../BankUtils';
import { useBalance } from '../../../hooks/useQueries';
import { useCreateTransaction, useUpdateBalance, useUpdateMoneyOut } from '../../../hooks/useMutations';
import { useCurrentUser } from '../../../lib/auth';
import { getErrorMessage } from '../../../lib/apiClient';
import { alert } from '../../../lib/alert';

const Transfermodal = ({ showModal, setShowModal }) => {
  const navigate = useNavigate();
  const [accountData, setAccountData] = useState(null);
  const [amount, setAmount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { userId } = useCurrentUser();
  const { data: balance = 0 } = useBalance();
  const { mutate: updateBalance } = useUpdateBalance();
  const { mutate: createTransaction } = useCreateTransaction();
  const { mutate: updateMoneyOut } = useUpdateMoneyOut();

  const handleClose = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const savedAccount = localStorage.getItem('selectedAccount');
    if (savedAccount) {
      setAccountData(JSON.parse(savedAccount));
    }

    const savedAmount = localStorage.getItem('transferAmount');
    if (savedAmount) {
      setAmount(parseFloat(savedAmount));
    }
  }, []);

  const PaymodelBtn = () => {
    const savedAccount = JSON.parse(localStorage.getItem('selectedAccount'));
    const savedAmount = parseFloat(localStorage.getItem('transferAmount'));

    if (!savedAmount || Number.isNaN(savedAmount)) {
      alert.error('Error', 'No transfer amount found.');
      return;
    }

    if (balance < savedAmount) {
      alert.error('Error', 'Insufficient balance');
      return;
    }

    setIsLoading(true);

    // Step 1: subtract the amount from the wallet
    updateBalance(savedAmount, {
      onSuccess: () => {
        const transactionData = {
          userId,
          bankName: savedAccount?.bankName,
          accountNumber: savedAccount?.accountNumber,
          accountName: savedAccount?.accountName,
          amount: savedAmount,
        };

        // Step 2: record the transaction
        createTransaction(transactionData, {
          onSuccess: (response) => {
            if (!response?.transactionId) {
              setIsLoading(false);
              alert.error('Error', 'Transaction failed');
              return;
            }

            localStorage.setItem('transactionId', response.transactionId);

            // Step 3: keep the money-out counter in sync
            updateMoneyOut(
              { userId, amount: savedAmount },
              {
                onSuccess: () => {
                  setIsLoading(false);
                  navigate('/transfersuccess', { state: response.transaction });
                },
                onError: (error) => {
                  setIsLoading(false);
                  alert.error('Error', getErrorMessage(error, 'Failed to update money out'));
                },
              },
            );
          },
          onError: (error) => {
            setIsLoading(false);
            alert.error('Error', getErrorMessage(error, 'Failed to complete payment'));
          },
        });
      },
      onError: (error) => {
        setIsLoading(false);
        alert.error('Error', getErrorMessage(error, 'Failed to complete payment'));
      },
    });
  };

  if (!accountData) {
    return (
      <Container fluid>
        <Modal className="border border-danger" show={showModal} onHide={handleClose} centered style={{ bottom: 0 }}>
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
        backdrop="static"
        className="custom-modal"
      >
        <div
          className="bg-white"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            margin: 0,
            zIndex: 1050,
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
          }}
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
                <div>
                  <img
                    src={getBankLogoByName(accountData.bankName)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '';
                      e.target.style.backgroundColor = '#f8f9fa';
                      e.target.style.objectFit = 'cover';
                      e.target.alt = 'Bank logo not available';
                    }}
                    style={{
                      width: 15,
                      height: 15,
                      objectFit: 'contain',
                      borderRadius: '50%',
                      backgroundColor: '#f0f0f0',
                    }}
                    className="me-1 mb-1"
                    alt={accountData.bankName}
                  />
                  <span className="fw-medium"> {accountData.bankName}</span>
                </div>
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
                <span className="fw-medium"> ₦{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
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
                  <div className="d-flex flex-column gap-2 bg-light p-3 rounded-3">
                    <div className="rounded d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <div>
                          <span className="fw-medium mb-1 d-block">Available Balance</span>
                          <span className="text-muted mx-1 mb-1 align-items-center">
                            (₦{balance.toLocaleString()}.00) <AlertCircle className="text-muted mb-1" size={15} />
                          </span>
                        </div>
                      </div>
                      <Check size={20} className="text-success" />
                    </div>

                    <hr
                      style={{
                        border: 'none',
                        borderTop: '2px dotted #ccc',
                        marginTop: '0.25rem',
                        marginBottom: '0.25rem',
                      }}
                    />

                    <div className="rounded d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <div>
                          <p className="fw-medium mb-1 text-muted">Wallet (₦{balance.toLocaleString()}.00)</p>
                        </div>
                      </div>
                      <div className="p-0 text-muted">-₦{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                disabled={isLoading}
                variant="success"
                style={{ backgroundColor: '#01B575' }}
                className="w-75 py-2 mt-2 mx-auto rounded-5 fs-5 border-0"
                onClick={PaymodelBtn}
              >
                {isLoading ? 'Processing...' : 'Pay'}
              </Button>
            </div>
          </Modal.Body>
        </div>
      </Modal>
    </Container>
  );
};

export default Transfermodal;
