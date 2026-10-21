import { useNavigate } from 'react-router-dom';
import { TbDiamond } from 'react-icons/tb';
import { BsFill0CircleFill } from 'react-icons/bs';
import { LiaUserCircle } from 'react-icons/lia';
import { GraphUpArrow, CreditCard } from 'react-bootstrap-icons';
import './UserDbpage/UserDb.css';

const items = [
  { key: 'home', label: 'Home', Icon: BsFill0CircleFill, to: '/userdb', active: true },
  { key: 'rewards', label: 'Rewards', Icon: TbDiamond, to: null },
  { key: 'finance', label: 'Finance', Icon: GraphUpArrow, to: null },
  { key: 'cards', label: 'Cards', Icon: CreditCard, to: null },
  { key: 'me', label: 'Me', Icon: LiaUserCircle, to: '/setting' },
];

const BottomNavigation = () => {
  const navigate = useNavigate();

  return (
    <nav className="opay-bottomnav" aria-label="Primary">
      <div className="opay-bottomnav__inner">
        {items.map(({ key, label, Icon, to, active }) => (
          <button
            type="button"
            key={key}
            className={`opay-bottomnav__item${active ? ' opay-bottomnav__item--active' : ''}`}
            onClick={to ? () => navigate(to) : undefined}
            aria-current={active ? 'page' : undefined}
          >
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
