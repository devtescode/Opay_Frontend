import './UserDbpage/UserDb.css';

const BusinessServiceRow = ({ sales = 0 }) => (
  <div className="opay-bizrow">
    <span className="opay-bizrow__icon">
      <i className="ri-store-2-line" aria-hidden="true" />
    </span>
    <span className="opay-bizrow__text">
      Business Service - Today&apos;s Sales:{' '}
      <span className="opay-bizrow__value">{`₦${Number(sales || 0).toLocaleString()}.00`}</span>
    </span>
    <i className="ri-arrow-right-s-line opay-bizrow__chev" aria-hidden="true" />
  </div>
);

export { BusinessServiceRow };
export default BusinessServiceRow;
