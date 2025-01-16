import React from 'react';
import { Container } from 'react-bootstrap';

import BalanceCard from '../BalanceCard';
import RecentTransactions from '../RecentTransactions';
import QuickActions from '../QuickActions';

import ReferralBanner from '../ReferralBanner';
import BottomNavigation from '../BottomNavigation';
// import styles from '../../../App.css';
import '/src/App.css'; // Import CSS directly
import Header from '../Header';
import Services from '../services ';

const UserDb= () => {
  return (
    <Container  className="appContainer bg-light min-vh-100">
      <Header/>
      <BalanceCard />
      <RecentTransactions />
      <QuickActions />
      <Services/>
      <ReferralBanner />
      <BottomNavigation />
    </Container>
    
  );
};

export default UserDb;

