import React, { useEffect, useState } from 'react';
import { API_URLS } from '../../../../utils/apiConfig';


const AdminDetails = () => {

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const adminToken = localStorage.getItem("adminToken");

            if (!adminToken) {
                Swal.fire("Error", "User not logged in.", "error");
                return;
            }

            const response = await fetch(API_URLS.changeadminpassword, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    adminToken,
                    OldPassword: oldPassword,
                    NewPassword: newPassword,
                }),
            });

            const result = await response.json();

            if (result.status) {
                Swal.fire("Success", result.message || "Password changed successfully!", "success");
                setOldPassword('');
                setNewPassword('');
            } else {
                Swal.fire("Error", result.message || "Failed to change password.", "error");
            }
        } catch (err) {
            console.error("Error changing password:", err);
            Swal.fire("Error", "Something went wrong.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="container mt-5 col-md-4 shadow p-4 rounded-3">
      <h3 className="mb-4">Admin Password</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Old Password</label>
          <input
            type="text"
            className="form-control"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="text"
            className="form-control"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button
          className="btn btn-success w-100"
          type="submit"
          disabled={!oldPassword || !newPassword || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
    );
};

export default AdminDetails;
