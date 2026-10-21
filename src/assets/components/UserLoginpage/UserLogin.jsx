import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Image } from 'react-bootstrap';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
import { useUserLogin } from '../../../hooks/useMutations';
import { useCurrentUser } from '../../../lib/auth';
import { DEFAULT_AVATAR, OPAY_LOGO } from '../../../lib/constants';

const UserLogin = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const { mutate: login, isPending: isLoading } = useUserLogin();

  const username = user?.username;
  const phoneNumber = user?.phoneNumber;
  const picture = user?.profilePicture || DEFAULT_AVATAR;

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const deviceInfo = navigator.userAgent;
    const existingSessionId = localStorage.getItem('sessionId') || null;

    login(
      { password, deviceInfo, sessionId: existingSessionId },
      {
        onSuccess: () => {
          navigate('/userdb');
        },
        onError: (error) => {
          const message = error?.response?.data?.message || 'Network issue. Please try again.';

          // A stale session id would otherwise block every future login
          if (message.includes('already logged in on another device')) {
            localStorage.removeItem('sessionId');
          }

          setErrorMessage(message);
        },
      },
    );
  };

  return (
    <Container className="d-flex flex-column align-items-center py-5" style={{ maxWidth: '400px' }}>
      <Image
        src={OPAY_LOGO}
        alt="Opay"
        style={{ width: '90px', height: '60px', objectFit: 'contain' }}
      />

      <div className="text-center mb-4 mt-2">
        <div className="position-relative d-inline-block mb-2">
          <Image src={picture} alt="Profile" roundedCircle style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
        </div>
        <h6 className="mb-4 mt-2 fs-3">
          {username || 'Welcome'}
          {phoneNumber && ` (${phoneNumber.slice(0, 3)}****${phoneNumber.slice(7)})`}
        </h6>
      </div>

      <Form className="w-100" onSubmit={handleLogin}>
        <div className="position-relative mb-4">
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter 6-digit Password"
            className="py-2 px-3 border-1 fs-5"
            maxLength={14}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="link"
            className="position-absolute top-50 end-0 translate-middle-y text-muted"
            onClick={() => setShowPassword(!showPassword)}
            type="button"
          >
            {showPassword ? <EyeFill size={20} /> : <EyeSlashFill size={20} />}
          </Button>
        </div>

        <div className="text-end mb-4">
          <span style={{ color: '#00B974' }}>Forgot Password?</span>
        </div>

        {errorMessage && <div className="text-danger text-center mb-4">{errorMessage}</div>}

        <div className="text-center">
          <Button
            type="submit"
            variant="success"
            className="w-75 py-2 mb-5 rounded-5"
            style={{ backgroundColor: '#01B575', borderColor: '#00D632' }}
            disabled={isLoading || !password}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </div>

        <div className="fixed-bottom mb-4">
          <div className="d-flex justify-content-center mb-4 text-center">
            <Button variant="link" className="text-decoration-none p-0" style={{ color: '#00B974' }}>
              Switch Account
            </Button>
            <Button variant="link" className="p-0 text-muted">
              |
            </Button>
            <Button variant="link" className="text-decoration-none p-0" style={{ color: '#00B974' }}>
              Login with FingerPrint
            </Button>
          </div>

          <div className="text-center text-muted" style={{ fontSize: '0.8rem' }}>
            <span>Licensed by the </span>
            <strong>CBN</strong>
            <span> and insured by the </span>
            <strong>NDIC</strong>
          </div>
        </div>
      </Form>
    </Container>
  );
};

export default UserLogin;
