
import { useState } from "react"
import { ChevronLeft, QrCode, XCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { API_URLS } from "../../../../utils/apiConfig";
import Toopay from "../../Image/Toopay.png" // Adjust the import path as necessary

const ToOpay = () => {
  const [activeTab, setActiveTab] = useState("recents");
  const [accountNumber, setAccountNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const recentContacts = [
    {
      id: 1,
      name: "OMOLOLA PRAISE OYEGBILE",
      phone: "811 074 7000",
      avatar: "/woman-profile.png",
    },
    {
      id: 2,
      name: "ISAIAH OLUWATOBA IYIOLA",
      phone: "916 683 4119",
      avatar: "/man-profile.png",
    },
    {
      id: 3,
      name: "AYOBAMI FAITH OLATAIWO",
      phone: "814 759 0731",
      avatar: "/diverse-person-profiles.png",
    },
  ];
  const navigate = useNavigate();
  const BackToHome = () => {
    navigate("/userdb");
  };

  // OPay account validation handler
  // Automatically validate and proceed when input is 10 or 11 digits
  const validateAndProceed = async (value) => {
    setIsLoading(true);
    setAccountName("");
    setErrorMsg("");
    try {
      const response = await fetch(API_URLS.useraccount, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          AccountNumber: value,
          Bankcode: "999992", // OPay's bank code (commonly used, adjust if your backend uses a different code)
        }),
      });
      const data = await response.json();
      if (response.ok && data.status) {
        setAccountName(data.accountName);
        setErrorMsg("");
        const accountDetails = {
          accountName: data.accountName,
          accountNumber: value,
          bankName: "OPay",
        };
        localStorage.setItem("selectedAccount", JSON.stringify(accountDetails));
        navigate("/transfer");
      } else {
        setErrorMsg("Invalid phone number or account number");
        setAccountName("");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to the server. Please try again later.");
      setAccountName("");
    } finally {
      setIsLoading(false);
    }
  };

  // Input handler: triggers validation when 10 or 11 digits
  const handleAccountInput = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setAccountNumber(value);
    if (!isLoading && (value.length === 10 || value.length === 11)) {
      validateAndProceed(value);
    }
  };

  return (
    <div
      className="container-fluid p-0"
      style={{ maxWidth: "448px", margin: "0 auto", backgroundColor: "white", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between p-3 bg-white">
        <div className="d-flex align-items-center">
          <ChevronLeft className="me-1" style={{ width: "24px", height: "24px", color: "#6c757d" }} onClick={BackToHome} />
          <p className=" mb-0 text-dark">Transfer to OPay Account</p>
        </div>
        <button className="btn btn-link p-0 text-decoration-none" style={{ color: "#20b2aa" }}>
          History
        </button>
      </div>

      {/* Promotional Banner */}
      <div className="px-3 mb-3 ">
        <div
          className="p-3 text-white position-relative overflow-hidden"
          style={{
            backgroundImage: `url(${Toopay})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '120px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* <div className="position-relative" style={{ zIndex: 10 }}>
            <p className="small mb-0 lh-base" style={{ color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
              OPay Partners with Olabisi Onabanjo University in Groundbreaking ₦1.2 Billion, 10-Year Scholarship Drive
            </p>
          </div> */}
        </div>
      </div>

      {/* Benefits Badge */}
      <div className="px-3 mb-4 ">
        <div
          className="border rounded-3 p-3 d-flex align-items-center"
          style={{ backgroundColor: "#f0fdfa", borderColor: "#99f6e4" }}
        >
          <div
            className="rounded-circle d-flex align-items-center justify-content-center me-2"
            style={{ width: "20px", height: "20px", backgroundColor: "#20b2aa" }}
          >
            <div className="rounded-circle bg-white" style={{ width: "8px", height: "8px" }}></div>
          </div>
          <span className="fw-medium" style={{ color: "#0f766e" }}>
            Instant, Zero Issues, Free
          </span>
        </div>
      </div>

      {/* Recipient Account Section */}
      <div className="px-3 mb-4 shadow-sm py-3 rounded-3 mx-2">
        <h2 className="h4 fw-semibold text-dark mb-3">Recipient Account</h2>

        <div className="position-relative mb-2">
          <input
            type="text"
            className="form-control form-control-lg border-secondary"
            placeholder="Phone No./OPay Account No./ID"
            value={accountNumber}
            onChange={handleAccountInput}
            maxLength={11}
            style={{ paddingRight: "48px", fontSize: "16px" }}
            inputMode="numeric"
            disabled={isLoading}
          />
          <button
            type="button"
            className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0"
            style={{ zIndex: 2 }}
            tabIndex={-1}
            onClick={() => setAccountNumber("")}
            aria-label="Clear input"
          >
            {accountNumber ? (
              <XCircle style={{ width: "22px", height: "22px", color: "#dfe2e7" }} />
            ) : (
              <QrCode style={{ width: "20px", height: "20px", color: "#6c757d" }} />
            )}
          </button>
        </div>
        {isLoading && (
          <div className="text-center mt-2">
            <span className="text-info">
              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              Searching...
            </span>
          </div>
        )}
        {errorMsg && (
          <div className="text-center mt-2">
            <span className="text-danger">{errorMsg}</span>
          </div>
        )}
        {accountName && (
          <div className="mt-3 text-center">
            <span className="fw-bold text-success">Account: {accountName}</span>
          </div>
        )}
        <p className="text-muted small mb-0 mt-2">
          Don't know the recipient's OPay account number?{" "}
          <button className="btn btn-link p-0 fw-medium text-decoration-none small" style={{ color: "#20b2aa" }}>
            Ask them {">"}
          </button>
        </p>
      </div>

      {/* Tabs */}
      <div className="px-3 mb-3">
        <div className="border-bottom">
          <div className="d-flex">
            <button
              onClick={() => setActiveTab("recents")}
              className={`btn btn-link text-decoration-none pb-1 px-1 me-4  border-2 ${activeTab === "recents" ? "border-info" : "border-transparent"
                }`}
              style={{
                color: activeTab === "recents" ? "#20b2aa" : "#6c757d",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              Recents
            </button>
            <button
              onClick={() => setActiveTab("favourites")}
              className={`btn btn-link text-decoration-none pb-1 px-1  border-2 ${activeTab === "favourites" ? "border-info" : "border-transparent"
                }`}
              style={{
                color: activeTab === "favourites" ? "#20b2aa" : "#6c757d",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              Favourites
            </button>
          </div>
        </div>
      </div>

      {/* Contact List */}
      <div className="px-3">
        {/* {activeTab === "recents" && (
          <div className="d-flex flex-column gap-3">
            {recentContacts.map((contact) => (
              <button
                key={contact.id}
                className="btn btn-light d-flex align-items-center gap-3 w-100 p-2 rounded-3 text-start border-0"
                onClick={() => setAccountNumber(contact.phone.replace(/\s/g, ""))}
                style={{ backgroundColor: "transparent" }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
              >
                <img
                  src={contact.avatar || "/placeholder.svg"}
                  alt={contact.name}
                  className="rounded-circle"
                  style={{ width: "48px", height: "48px", objectFit: "cover" }}
                />
                <div className="flex-grow-1">
                  <p className="fw-medium text-dark small mb-0">{contact.name}</p>
                  <p className="text-muted small mb-0">{contact.phone}</p>
                </div>
              </button>
            ))}
          </div>
        )} */}
        <p>No transaction display</p>

        {activeTab === "favourites" && (
          <div className="text-center py-5 text-muted">
            <p>No favourites yet</p>
          </div>
        )}

        {/* <div className="text-center mt-4">
          <button className="btn btn-link text-muted small text-decoration-none">View All {">"}</button>
        </div> */}
      </div>
    </div>
  )
}

export default ToOpay