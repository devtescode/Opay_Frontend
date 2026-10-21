import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Dropdown, Spinner } from 'react-bootstrap';
import { ArrowDown, ArrowUp, Download } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useBalance, useMoneyOut, useTransactions } from '../../../hooks/useQueries';
import { useReverseTransaction } from '../../../hooks/useMutations';
import { useCurrentUser } from '../../../lib/auth';

const REVERSE_AFTER_MS = 20000;
const PAGE_SIZE = 200;

const now = new Date();
const CURRENT_MONTH = now.getMonth() + 1;
const CURRENT_YEAR = now.getFullYear();

const months = [...Array(12)].map((_, i) => i + 1);
const years = [2023, 2024, 2025, 2026];

const StoreTransaction = () => {
  const navigate = useNavigate();
  const { userId } = useCurrentUser();

  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [showModal, setShowModal] = useState(false);
  const [tempMonth, setTempMonth] = useState(CURRENT_MONTH);
  const [tempYear, setTempYear] = useState(CURRENT_YEAR);

  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const monthItemRefs = useRef([]);
  const yearItemRefs = useRef([]);

  const { data: transactionsData, isPending, isError, refetch } = useTransactions(userId, {
    month: selectedMonth,
    year: selectedYear,
    limit: PAGE_SIZE,
  });
  const { data: balance = 0 } = useBalance();
  const { data: moneyOut = 0 } = useMoneyOut(userId);
  const { mutate: reverseTransaction } = useReverseTransaction();

  const transactions = useMemo(() => transactionsData?.items ?? [], [transactionsData]);

  // Pending transactions are auto-reversed after 20s (unchanged behaviour).
  const reversedRef = useRef(new Set());
  useEffect(() => {
    const timers = transactions
      .filter((transaction) => transaction.status === 'pending' && !reversedRef.current.has(transaction._id))
      .map((transaction) => {
        reversedRef.current.add(transaction._id);
        return setTimeout(() => reverseTransaction(transaction._id), REVERSE_AFTER_MS);
      });

    return () => timers.forEach(clearTimeout);
  }, [transactions, reverseTransaction]);

  const toggleModal = () => {
    if (showModal) {
      setTempMonth(selectedMonth);
      setTempYear(selectedYear);
    }
    setShowModal(!showModal);
  };

  useEffect(() => {
    if (!showModal) return;

    const elMonth = monthRef.current?.querySelector(`[data-value="${tempMonth}"]`);
    const elYear = yearRef.current?.querySelector(`[data-value="${tempYear}"]`);
    elMonth?.scrollIntoView({ behavior: 'instant', block: 'center' });
    elYear?.scrollIntoView({ behavior: 'instant', block: 'center' });
  }, [showModal, tempMonth, tempYear]);

  const handleConfirm = () => {
    setSelectedMonth(tempMonth);
    setSelectedYear(tempYear);
    setShowModal(false);
  };

  useEffect(() => {
    if (!showModal) return;

    const observeItems = (refsArray, containerRef, setSelected) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.9) {
              const value = Number(entry.target.getAttribute('data-value'));
              if (value) setSelected(value);
            }
          });
        },
        {
          root: containerRef.current,
          threshold: [0.9],
        },
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
      elMonth?.scrollIntoView({ behavior: 'instant', block: 'center' });
      elYear?.scrollIntoView({ behavior: 'instant', block: 'center' });
    };

    scrollToSelected();

    return () => {
      cleanupMonth();
      cleanupYear();
    };
  }, [showModal, selectedMonth, selectedYear]);

  const pickerStyles = {
    flex: 1,
    height: '120px',
    overflowY: 'scroll',
    scrollSnapType: 'y mandatory',
    scrollBehavior: 'smooth',
    textAlign: 'center',
    position: 'relative',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  };

  const highlightOverlay = {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: '40px',
    marginTop: '-20px',
    borderTop: '1px solid #E2E2E2',
    borderBottom: '1px solid #E2E2E2',
    pointerEvents: 'none',
    zIndex: 1,
  };

  const handleTransactionClick = (transaction) => {
    navigate('/transactiondetails', { state: transaction });
  };

  if (isPending) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-4">
        <p className="text-danger">Failed to fetch transactions</p>
        <Button variant="success" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-light d-flex flex-column vh-100">
      <div className="bg-white">
        <div className="d-flex justify-content-between align-items-center p-3">
          <div className="d-flex align-items-center">
            <i className="ri-arrow-left-s-line me-2" onClick={() => navigate('/userdb')} role="button" aria-label="Back to dashboard"></i>
            Transactions
          </div>
          <div style={{ color: '#01B575' }}>
            <Download aria-hidden="true" />
          </div>
        </div>

        <div className="d-flex gap-2 py-3 mx-2">
          <Dropdown className="flex-grow-1">
            <Dropdown.Toggle variant="light" className="w-100 text-start mx-auto text-center">
              All Categories
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>All Categories</Dropdown.Item>
              <Dropdown.Item>Transfers</Dropdown.Item>
              <Dropdown.Item>Interest</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown className="flex-grow-1">
            <Dropdown.Toggle variant="light" className="w-100 text-start mx-auto text-center">
              All Status
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>All Status</Dropdown.Item>
              <Dropdown.Item>Successful</Dropdown.Item>
              <Dropdown.Item>Failed</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <div className="p-3 bg-white mt-3 mx-2">
        <div>
          <div className="d-flex justify-content-between">
            <div>
              <span>
                {new Date(selectedYear, selectedMonth - 1).toLocaleString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
              <span onClick={toggleModal} role="button" tabIndex={0}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                  <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                </svg>
              </span>
            </div>
            <div>
              <Button variant="success px-2 rounded-4 py-0" style={{ backgroundColor: '#01B575', border: '0', color: '#BBEFE4' }}>
                Analysis
              </Button>
            </div>
          </div>

          {/* Modal */}
          {showModal && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}
              onClick={toggleModal}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  backgroundColor: '#fff',
                  borderTopLeftRadius: '1.2rem',
                  borderTopRightRadius: '1.2rem',
                  padding: '20px',
                  boxShadow: '0 -4px 12px rgba(0,0,0,0.2)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ fontWeight: 'bold', borderBottom: '2px solid #00c853', paddingBottom: '5px' }}>Month</span>
                  <span style={{ color: '#aaa' }}>Time Frame</span>
                  <span onClick={toggleModal} style={{ fontWeight: 'bold', cursor: 'pointer' }}>✕</span>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '20px', position: 'relative' }}>
                  <div style={highlightOverlay} />

                  <div style={pickerStyles} ref={monthRef}>
                    {months.map((month, index) => (
                      <div
                        key={month}
                        data-value={month}
                        ref={(el) => (monthItemRefs.current[index] = el)}
                        style={{
                          scrollSnapAlign: 'center',
                          padding: '12px 0',
                          fontSize: '20px',
                          fontWeight: tempMonth === month ? 'bold' : 'normal',
                          color: tempMonth === month ? '#000' : '#aaa',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          setTempMonth(month);
                          monthItemRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                      >
                        {month.toString().padStart(2, '0')}
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
                          scrollSnapAlign: 'center',
                          padding: '12px 0',
                          fontSize: '20px',
                          fontWeight: selectedYear === year ? 'bold' : 'normal',
                          color: selectedYear === year ? '#000' : '#aaa',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          setTempYear(year);
                          yearItemRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
                    width: '100%',
                    padding: '15px',
                    backgroundColor: '#01B575',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-muted small">
          <span>In: {`₦${(balance * 2).toLocaleString()}.00`}</span>
          <span className="ms-3">Out: ₦{moneyOut.toLocaleString()}.00</span>
        </div>
      </div>

      <div className="flex-grow-1 overflow-auto bg-white mx-2">
        {transactions.length === 0 ? (
          <p className="text-center p-3">No transactions found</p>
        ) : (
          transactions.map((transaction) => {
            const isIncoming = transaction.type === 'incoming';

            return (
              <div
                className="d-flex align-items-center p-2"
                key={transaction._id}
                onClick={() => handleTransactionClick(transaction)}
                style={{ cursor: 'pointer' }}
              >
                <div
                  className="p-2 me-2 d-flex mx-auto justify-content-center text-center align-items-center"
                  style={{ backgroundColor: '#ECFBF6', borderRadius: '1000px', height: '35px', width: '35px' }}
                >
                  {isIncoming ? <ArrowDown className="text-success" /> : <ArrowUp className="text-success" />}
                </div>

                <div className="flex-grow-1">
                  <div
                    className="text-truncate"
                    style={{ fontSize: '12px', whiteSpace: 'normal', wordBreak: 'break-word' }}
                  >
                    {isIncoming ? 'Transfer from' : 'Transfer to'} {transaction.accountName}
                  </div>
                  <small className="text-muted">
                    {format(new Date(transaction.createdAt), 'MMM do, yyyy hh:mm:ss a')}
                  </small>
                </div>

                <div
                  className="d-flex flex-column justify-content-center align-items-end"
                  style={{ minWidth: '100px', minHeight: '100%' }}
                >
                  <span
                    className="fw-medium"
                    style={{
                      color: transaction.status === 'Reversed' || isIncoming ? '#1FAB7C' : '#000',
                      verticalAlign: 'middle',
                    }}
                  >
                    {transaction.status === 'Reversed' || isIncoming
                      ? `+₦${Math.abs(transaction.amount).toLocaleString()}.00`
                      : `-₦${Math.abs(transaction.amount).toLocaleString()}.00`}
                  </span>
                  <div
                    className="rounded-1 px-1 text-center"
                    style={{
                      fontSize: '12px',
                      backgroundColor:
                        transaction.status === 'successful'
                          ? '#CAFBF0'
                          : transaction.status === 'failed'
                            ? '#F8D7DA'
                            : '#FFF3CD',
                      color:
                        transaction.status === 'successful'
                          ? '#52C59D'
                          : transaction.status === 'failed'
                            ? '#842029'
                            : '#664d03',
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
    </div>
  );
};

export default StoreTransaction;
