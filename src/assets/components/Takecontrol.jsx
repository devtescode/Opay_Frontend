import message from '../Image/message.png';
import './UserDbpage/UserDb.css';

const Takecontrol = () => (
  <section className="opay-promo">
    <div className="opay-promo__inner">
      <img className="opay-promo__art" src={message} alt="" width={52} height={52} />
      <div className="opay-promo__body">
        <p className="opay-promo__title">Take Control, Stay Informed</p>
        <p className="opay-promo__text">Add your email, get the latest from OPay</p>
      </div>
    </div>
    <div className="opay-dots" aria-hidden="true">
      <span className="opay-dots__dot" />
      <span className="opay-dots__dot opay-dots__dot--active" />
    </div>
  </section>
);

export default Takecontrol;
