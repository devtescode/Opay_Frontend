import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BalanceCard from '../BalanceCard';
import RecentTransactions from '../RecentTransactions';
import QuickActions from '../QuickActions';
import ReferralBanner from '../ReferralBanner';
import BottomNavigation from '../BottomNavigation';
import Header from '../Header';
import Services from '../Services';
import Takecontrol from '../Takecontrol';
import './UserDb.css';
import { useCurrentUser } from '../../../lib/auth';
import { clearUserSession } from '../../../lib/apiClient';
import { useMoneyOut, useSessionStatus, useTransactions } from '../../../hooks/useQueries';

const RECENT_LIMIT = 5;

const DashboardStats = ({ userId }) => {
  const { data: moneyOut = 0, isPending: moneyOutPending } = useMoneyOut(userId);
  const { data: transactions, isPending: txPending } = useTransactions(userId, { limit: RECENT_LIMIT });

  const totalTransactions = transactions?.total ?? 0;

  return (
    <div className="opay-stats">
      <div className="opay-stat">
        <p className="opay-stat__label">
          <i className="ri-arrow-down-line" aria-hidden="true" /> Money out
        </p>
        <p className="opay-stat__value opay-stat__value--out">
          {moneyOutPending ? '—' : `₦${Number(moneyOut).toLocaleString()}.00`}
        </p>
      </div>

      <div className="opay-stat">
        <p className="opay-stat__label">
          <i className="ri-arrow-left-right-line" aria-hidden="true" /> Transactions
        </p>
        <p className="opay-stat__value">{txPending ? '—' : totalTransactions.toLocaleString()}</p>
      </div>
    </div>
  );
};

const UserDb = () => {
  const navigate = useNavigate();
  const { userId } = useCurrentUser();

  // Polls the backend instead of listening on a socket: when an admin ends
  // this session the poll comes back inactive and we sign the user out.
  const { data: session } = useSessionStatus();

  useEffect(() => {
    if (session && session.active === false) {
      clearUserSession();

      if (window.Swal) {
        window.Swal.fire({
          title: 'Session ended',
          text: 'Your account has been logged out because you attempted to login to another device while an active session was already logged in on your current device. Please note, if you try to login on a different device again with your account, it will be blocked.',
          icon: 'warning',
          confirmButtonText: 'OK',
        }).then(() => navigate('/'));
      } else {
        navigate('/');
      }
    }
  }, [session, navigate]);

  return (
    <div className="opay-dash">
      <Header />

      <main className="opay-dash__shell">
        <div className="opay-dash__grid">
          <div className="opay-dash__col">
            <BalanceCard />
            <DashboardStats userId={userId} />
            <QuickActions />
            <Services />
          </div>

          <div className="opay-dash__col">
            <RecentTransactions userId={userId} />
            <ReferralBanner />
            <Takecontrol />
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default UserDb;
