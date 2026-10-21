import { useNavigate } from 'react-router-dom';
import './UserDbpage/UserDb.css';

const items = [
  { key: 'home', label: 'Home', to: '/userdb', active: true, logo: '/icons/opay.jpg' },
  { key: 'rewards', label: 'Rewards', icon: 'ri-heart-3-line', to: null },
  { key: 'wealth', label: 'Wealth', icon: 'ri-line-chart-line', to: null },
  { key: 'cards', label: 'Cards', icon: 'ri-bank-card-line', to: null },
  { key: 'me', label: 'Me', icon: 'ri-user-3-line', to: '/setting' },
];

const BottomNavigation = () => {
  const navigate = useNavigate();

  return (
    <nav className="opay-nav" aria-label="Primary">
      <div className="opay-nav__bar">
        {items.map(({ key, label, icon, to, active, logo }) => (
          <button
            type="button"
            key={key}
            className={`opay-nav__item${active ? ' opay-nav__item--active' : ''}`}
            onClick={to ? () => navigate(to) : undefined}
            aria-current={active ? 'page' : undefined}
          >
            <span className="opay-nav__icon">
              {logo ? (
                <img className="opay-nav__logo" src={logo} alt="" width={24} height={24} />
              ) : (
                <i className={icon} aria-hidden="true" />
              )}
            </span>
            <span className="opay-nav__label">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
