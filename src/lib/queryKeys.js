/**
 * Centralised query key factory.
 * Keeping every key in one place makes invalidation predictable and avoids
 * typos that would silently orphan cache entries.
 */
export const queryKeys = {
  balance: ['balance'],
  moneyOut: (userId) => ['money-out', userId],
  transactions: (userId) => ['transactions', userId],
  lastTransactions: (userId) => ['last-transactions', userId],
  beneficiaries: (userId, showAll) => ['beneficiaries', userId, showAll],
  beneficiarySearch: (userId) => ['beneficiary-search', userId],
  opayRecents: (userId) => ['opay-recents', userId],
  sessionStatus: ['session-status'],
  admin: {
    root: ['admin'],
    users: ['admin', 'users'],
    counts: ['admin', 'counts'],
    totalBalance: ['admin', 'total-balance'],
    sessions: ['admin', 'sessions'],
    userTransactions: (userId) => ['admin', 'user-transactions', userId],
    payments: ['admin', 'payments'],
    funding: ['admin', 'funding'],
  },
};

export default queryKeys;
