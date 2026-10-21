import './UserDbpage/UserDb.css';

const services = [
  { key: 'airtime', label: 'Airtime', icon: 'ri-bar-chart-2-line' },
  { key: 'data', label: 'Data', icon: 'ri-arrow-down-line' },
  { key: 'betting', label: 'Betting', icon: 'ri-game-line' },
  { key: 'electricity', label: 'Electricity', icon: 'ri-plug-line' },
  { key: 'fixed', label: 'Fixed', icon: 'ri-shopping-bag-line' },
  { key: 'loan-center', label: 'Loan Center', icon: 'ri-wallet-3-line' },
  { key: 'invitation', label: 'Invitation', icon: 'ri-megaphone-line' },
  { key: 'more', label: 'More', icon: 'ri-more-2-line' },
];

const Services = () => (
  <section className="opay-services" aria-label="Services">
    {services.map(({ key, label, icon }) => (
      <button type="button" className="opay-service" key={key}>
        <span className="opay-service__icon">
          <i className={icon} aria-hidden="true" />
        </span>
        <span className="opay-service__label">{label}</span>
      </button>
    ))}
  </section>
);

export default Services;
