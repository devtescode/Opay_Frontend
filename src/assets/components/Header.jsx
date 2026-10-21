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
    <header className="opay-topbar">
      <div className="opay-topbar__inner">
        <div
          className="opay-topbar__left"
          style={{ display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <span className="opay-topbar__avatar-wrap" style={{ position: 'relative' }}>
            <img
              className="opay-topbar__avatar"
              src={profilePicture}
              alt={`${username} profile`}
              onClick={openUpload}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openUpload()}
              aria-label="Update profile picture"
              style={{ width: 44, height: 44, borderRadius: '50%' }}
            />
            <span className="opay-topbar__avatar-badge" aria-hidden="true">
              <span className="opay-topbar__avatar-badge-text">₦3</span>
            </span>
          </span>

          <span className="opay-topbar__title" style={{ whiteSpace: 'nowrap' }}>
            {`Hi,${username}`}
          </span>
        </div>

        <div className="opay-topbar__actions">
          <button type="button" className="opay-topbar__action" aria-label="Help and support">
            <i className="ri-headphone-line" aria-hidden="true" />
            <span className="opay-help-pill">HELP</span>
          </button>

          <button type="button" className="opay-topbar__action" aria-label="Full screen">
            <i className="ri-fullscreen-line" aria-hidden="true" />
          </button>

          <button type="button" className="opay-topbar__action" aria-label="Notifications">
            <i className="ri-notification-3-line" aria-hidden="true" />
            <span className="opay-count-badge">99+</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
