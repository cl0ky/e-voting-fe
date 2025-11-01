export const calculatePropertyDetails = ({
  price,
  kprCosts,
  margin,
  downPaymentPercentage = 5,
  tenorDP = 0,
  tenor = 20,
}: {
  price: number;
  kprCosts: number;
  margin: number;
  downPaymentPercentage?: number;
  tenorDP?: number;
  tenor?: number;
}) => {
  // Calculate listing price with KPR costs
  const listingKPR = Number(price) + Number(kprCosts);

  // Calculate HB price by applying margin
  const hbPrice = listingKPR + listingKPR * (margin / 100);

  // Calculate total down payment (percentage of hbPrice)
  const totalDownPayment = downPaymentPercentage + (downPaymentPercentage / 100) * hbPrice;

  // Calculate down payment per month
  const totalDownPaymentPerMonth = totalDownPayment / tenorDP;

  // Calculate plafon price (hbPrice - down payment)
  const plafonPrice = hbPrice - totalDownPayment;

  // Calculate cost rent house for 5 years
  const costRentHouse5Year = () => {
    const interestRate = 0.1 / 12;
    const durationMonths = tenor * 12;
    return (interestRate * plafonPrice) / (1 - Math.pow(1 + interestRate, -durationMonths));
  };

  // Calculate cost rent house for more than 5 years
  const costRentHouseMoreThan5Year = () => {
    const interestRate = 0.135 / 12;
    const durationMonths = tenor * 12;
    return (interestRate * hbPrice) / (1 - Math.pow(1 + interestRate, -durationMonths));
  };

  // Return all calculated values
  return {
    listingKPR,
    hbPrice,
    totalDownPayment,
    totalDownPaymentPerMonth,
    plafonPrice,
    costRentHouse5Year: costRentHouse5Year(),
    costRentHouseMoreThan5Year: costRentHouseMoreThan5Year(),
  };
};
