import { PlacesResponse } from '@/@types/database';
import pb from '@/api/pocketbase';
import ButtonCheck from '@/components/atoms/ButtonCheck/ButtonCheck';
import PlaceSection from '@/components/molecules/PlaceSection/PlaceSection';
import { service } from '@/data/service';
import React, { useEffect, useState } from 'react';
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

const ServiceCanUse = ({ placeData }: any) => {
  const [serviceList, setServiceList] = useState<Array<Object>>();
  const [isChecked, setIsChecked] = useState(false);
  useEffect(() => {
    const serviceCan: Array<Object> | undefined = [];
    placeData.service.map((item: string) => {
      serviceCan.push(service[0][item]);
    });
    setServiceList(serviceCan);
  }, []);

  return (
    <StyledServiceContainer>
      {serviceList
        ? serviceList.map((item: any, index: number, array: Object[]) => {
            return (
              <ButtonCheck key={item.name} title={item.name} isChecked={false}>
                {item.text}
              </ButtonCheck>
            );
          })
        : ''}
    </StyledServiceContainer>
  );
};

export default ServiceCanUse;
