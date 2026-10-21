import {
  RiSmartphoneLine,
  RiBarChartLine,
  RiTvLine,
  RiMoneyDollarCircleLine,
  RiBankCardLine,
  RiGamepadLine,
  RiMore2Line,
  RiFootballLine,
} from 'react-icons/ri';
import './UserDbpage/UserDb.css';

const services = [
  { key: 'airtime', icon: <RiSmartphoneLine />, label: 'Airtime', badge: 'Up to 6%' },
  { key: 'data', icon: <RiBarChartLine />, label: 'Data', badge: 'Up to 6%' },
  { key: 'betting', icon: <RiFootballLine />, label: 'Betting' },
  { key: 'tv', icon: <RiTvLine />, label: 'TV' },
  { key: 'owalth', icon: <RiMoneyDollarCircleLine />, label: 'Owealth' },
  { key: 'loan', icon: <RiBankCardLine />, label: 'Loan' },
  { key: 'play4achild', icon: <RiGamepadLine />, label: 'Play4achild' },
  { key: 'more', icon: <RiMore2Line />, label: 'More' },
];

const Services = () => (
  <section className="opay-services" aria-label="Services">
    {services.map(({ key, icon, label, badge }) => (
      <button type="button" className="opay-service" key={key}>
        <span className="opay-service__icon">{icon}</span>
        <span className="opay-service__label">{label}</span>
        {badge && <span className="visually-hidden">{badge}</span>}
      </button>
    ))}
  </section>
);

export default Services;
