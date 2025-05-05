import React, { useState } from 'react';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // for disabling the button

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      

      const response = await fetch(`http://localhost:4000/useropay/changepassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.userId,
          oldPassword,
          newPassword
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire("Success", "Password changed successfully!", "success");
        setOldPassword('');
        setNewPassword('');
      } else {
        Swal.fire("Error", result.message || "Old password is incorrect.", "error");
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
      <h3 className="mb-4">Change Password</h3>
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

export default ChangePassword;
