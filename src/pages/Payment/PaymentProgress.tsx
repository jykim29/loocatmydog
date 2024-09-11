import { useSearchParams } from 'react-router-dom';

export const PaymentProgress = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams);
  return <div>Payment Progress</div>;
};
