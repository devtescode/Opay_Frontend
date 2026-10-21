import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../lib/auth';
import { DEFAULT_AVATAR } from '../../lib/constants';
import './UserDbpage/UserDb.css';

const Header = () => {
  const navigate = useNavigate();
  const { user } = useCurrentUser();

  const username = user?.username || 'User';
  const profilePicture = user?.profilePicture || DEFAULT_AVATAR;

  const openUpload = () => navigate('/upload');

  return (
    <header className="opay-dash__header">
      <div className="opay-dash__header-inner">
        <div className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
          <img
            src={profilePicture}
            alt={`${username} profile`}
            className="opay-dash__avatar"
            onClick={openUpload}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openUpload()}
            aria-label="Update profile picture"
          />
          <div style={{ minWidth: 0 }}>
            <p className="opay-dash__greeting">Hi, {username}</p>
            <p className="opay-dash__greeting-sub">Welcome back to your wallet</p>
          </div>
        </div>

        <div className="opay-dash__header-actions">
          <button type="button" className="opay-dash__icon-btn" aria-label="Scan QR code">
            <i className="ri-qr-scan-2-line" aria-hidden="true" />
          </button>

          <button type="button" className="opay-dash__icon-btn" aria-label="Notifications">
            <i className="ri-notification-3-line" aria-hidden="true" />
            <span className="opay-dash__icon-dot" aria-hidden="true">
              9
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
