import bankData from './Data.json';

export const getBankLogoByName = (bankName) => {
  const bank = bankData.banks.find(b => b.name.toLowerCase() === bankName.toLowerCase());
  return bank?.logo || null;
};


