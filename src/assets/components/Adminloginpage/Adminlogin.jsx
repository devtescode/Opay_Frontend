import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminLogin } from '../../../hooks/useMutations';

const Adminlogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const { mutate: login, isPending: isLoading } = useAdminLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    login(
      { email, password },
      {
        onSuccess: (data) => {
          setSuccessMessage(data.message);
          navigate('/admindb');
        },
        onError: (error) => {
          setErrorMessage(error?.response?.data?.message || 'Login failed');
        },
      },
    );
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ background: 'linear-gradient(to right, #141e30, #243b55)' }}
    >
      <div
        className="card p-4 rounded shadow-lg"
        style={{
          maxWidth: '400px',
          width: '95%',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
          color: '#fff',
        }}
      >
        <div className="text-center">
          <h3 className="mb-3" style={{ color: '#00c6ff' }}>
            Admin Login
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <span className="input-group-text bg-transparent border-light text-white">
              <i className="ri-mail-volume-line" />
            </span>
            <input
              type="email"
              className="form-control text-white"
              style={{ background: 'rgba(255, 255, 255, 0.2)', border: 'none', padding: '12px' }}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text bg-transparent border-light text-white">
              <i className="ri-lock-2-fill" />
            </span>
            <input
              type="password"
              className="form-control text-white"
              style={{ background: 'rgba(255, 255, 255, 0.2)', border: 'none', padding: '12px' }}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="btn w-50"
              style={{
                background: 'linear-gradient(to right, #00c6ff, #0072ff)',
                border: 'none',
                borderRadius: '10px',
                padding: '12px',
                color: '#fff',
                fontWeight: 'bold',
                transition: '0.3s',
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default Adminlogin;
