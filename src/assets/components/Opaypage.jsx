import React from 'react'
import { Shield } from "lucide-react"

const Opaypage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to login page after 3 seconds
        const timer = setTimeout(() => {
            navigate("/"); // Redirect to login page
        }, 3000);

        return () => clearTimeout(timer); // Cleanup timer
    }, [navigate]);
    return (
        <div>
            <div
                className="container-fluid vh-100 d-flex flex-column justify-content-between p-0"
                style={{ backgroundColor: "#00B875" }}
            >
                <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
                    <div
                        className="bg-white rounded-circle p-3 mb-4"
                        style={{ width: "100px", height: "100px", display: "flex", justifyContent: "center", alignItems: "center" }}
                    >
                        <div className="position-relative" style={{ width: "70px", height: "70px" }}>
                            <div
                                className="rounded-circle"
                                style={{ width: "70px", height: "70px", border: "10px solid #00C853" }}
                            ></div>
                            <div
                                className="position-absolute bg-dark border border-2 border-white"
                                style={{ width: "19px", height: "15px", bottom: "25px", left: "-2px" }}
                            ></div>
                        </div>
                    </div>

                    {/* Text */}
                    <h1 className="text-center fw-bold mb-0" style={{ color: "#3a0ca3" }}>
                        We are Beyond Banking
                    </h1>
                    <div className="mb-5 mt-5">
                        <div className="d-flex justify-content-center align-items-center gap-2 text-dark mb-4">
                            <Shield size={16} />
                            <span>
                                Licensed by the <strong>CBN</strong> and insured by the <strong>NDIC</strong>
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Opaypage