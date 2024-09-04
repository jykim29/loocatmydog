import { service } from '@/data/service';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

//test

//type 지정
// interface serviceProps {
//   [key]: { name: string; text: string };
// }

//styled 지정
const StyledServiceContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;
const StyledServiceCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 5px;
  max-inline-size: 140px;
  min-block-size: 70px;
  inline-size: 30%;
  font-size: 0.625rem;
  font-weight: 300;
  border: 1px solid #f1f1f1;
  border-radius: 4px;
  padding: 6px 8px;
  text-align: center;
  word-break: keep-all;
  & .service-title {
    font-size: 0.75rem;
    font-weight: 700;
  }
  & .service-description {
    letter-spacing: -0.5px;
  }
`;
const ServiceCanUse = ({ placeData }: any) => {
  const [serviceList, setServiceList] = useState<Array<Object>>();
  const [isChecked, setIsChecked] = useState(false);
  useEffect(() => {
    const serviceCan: Array<Object> | undefined = [...placeData.service].map(
      (item: string) => service[item]
    );
    setServiceList(serviceCan);
  }, []);

  return (
    <StyledServiceContainer>
      {serviceList
        ? serviceList.map((item: any) => {
            return (
              <StyledServiceCard key={item.name}>
                <span className="service-title">{item.name}</span>
                <span className="service-description">{item.text}</span>
              </StyledServiceCard>
            );
          })
        : ''}
    </StyledServiceContainer>
  );
};

export default ServiceCanUse;
