import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import WalletHero from './WalletHero';
import TransferStrip from './TransferStrip';
import BusinessServiceRow from '../BusinessServiceRow';
import QuickActions from '../QuickActions';
import Takecontrol from '../Takecontrol';
import Services from '../Services';
import BottomNavigation from '../BottomNavigation';
import './UserDb.css';
import { useCurrentUser } from '../../../lib/auth';
import { clearUserSession } from '../../../lib/apiClient';
import { useBalance, useLastTransfer, useSessionStatus, useTodayTotals } from '../../../hooks/useQueries';

const UserDb = () => {
  const navigate = useNavigate();
  const { userId } = useCurrentUser();

  // The balance starts masked, like the reference design.
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);

  const { data: balance = 0, isPending, isError, refetch } = useBalance();
  const { data: lastTransfer, isPending: transferPending } = useLastTransfer(userId);
  const { data: todayTotals } = useTodayTotals(userId);

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

  const toggleBalance = () => setIsBalanceVisible((prev) => !prev);

  return (
    <div className="opay-page">
      <Header />

      <main className="opay-page__shell">
        <div className="opay-grabber" aria-hidden="true" />

        <WalletHero
          balance={balance}
          isBalanceVisible={isBalanceVisible}
          onToggleBalance={toggleBalance}
          earnedToday={todayTotals?.earnedToday ?? 0}
          isEarnedVisible={isBalanceVisible}
          isLoading={isPending}
          isError={isError}
          onRetry={() => refetch()}
        />

        <TransferStrip
          transfer={lastTransfer}
          isLoading={transferPending}
          onOpenTransactions={() => navigate('/storetransaction')}
        />

        <BusinessServiceRow sales={todayTotals?.salesToday ?? 0} />

        <QuickActions />

        <Takecontrol />

        <Services />
      </main>

      <BottomNavigation />
    </div>
  );
};

export default UserDb;
