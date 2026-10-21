import message from '../Image/message.png';
import './UserDbpage/UserDb.css';

const Takecontrol = () => (
  <section className="opay-section">
    <div className="opay-promo">
      <span className="opay-promo__icon">
        <img src={message} alt="" width={20} height={20} />
      </span>
      <div>
        <p className="opay-promo__title">Take Control, Stay Informed</p>
        <p className="opay-promo__text">Add your email to get the latest from Opay</p>
      </div>
    </div>
  </section>
);

export default Takecontrol;
