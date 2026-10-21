import { useState } from 'react';
import { useChangePassword } from '../../../hooks/useMutations';
import { getErrorMessage } from '../../../lib/apiClient';
import { alert } from '../../../lib/alert';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const { mutate: changePassword, isPending: isSubmitting } = useChangePassword();

  const handleSubmit = (e) => {
    e.preventDefault();

    changePassword(
      { oldPassword, newPassword },
      {
        onSuccess: (result) => {
          if (result?.status) {
            alert.success('Success', result.message || 'Password changed successfully!');
            setOldPassword('');
            setNewPassword('');
          } else {
            alert.error('Error', result?.message || 'Failed to change password.');
          }
        },
        onError: (error) => {
          alert.error('Error', getErrorMessage(error, 'Something went wrong.'));
        },
      },
    );
  };

  return (
    <div className="container mt-5 col-md-4 shadow p-4 rounded-3">
      <h3 className="mb-4">Change Password</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="oldPassword">
            Old Password
          </label>
          <input
            id="oldPassword"
            type="text"
            className="form-control"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="newPassword">
            New Password
          </label>
          <input
            id="newPassword"
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
