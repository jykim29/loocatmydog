import { useEffect } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import styled from 'styled-components';
import Button from '@/components/atoms/Button/Button';
import PlaceSection from '@/components/molecules/PlaceSection/PlaceSection';
import AnimalPick from '@/components/organisms/AnimalPick/AnimalPick';
import DatePick from '@/components/organisms/DatePick/DatePick';
import PlaceIntroduce from '@/components/organisms/PlaceIntroduce/PlaceIntroduce';
import PlaceLocation from '@/components/organisms/PlaceLocation/PlaceLocation';
import PlaceReview from '@/components/organisms/PlaceReview/PlaceReview';
import PlaceTitleSection from '@/components/organisms/PlaceTitle/PlaceTitle';
import ServiceCanUse from '@/components/organisms/ServiceCanUse/ServiceCanUse';
import ServicePrice from '@/components/organisms/ServicePrice/ServicePrice';
import SwiperProfile from '@/components/organisms/SwiperProfile/SwiperProfile';
import { useAuthStore } from '@/store/useAuthStore';
import useDateRangeStore from '@/store/useDateRange';
import useReservationStore from '@/store/useReservationStore';
import createChatRoom from '@/pages/ChatRoom/createChatRoom';

const StyledButtonContainer = styled.div`
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
`;

const PlaceDetail = () => {
  const { resetDateRange } = useDateRangeStore();
  useEffect(() => {
    return () => resetDateRange();
  }, []);
  const { reservation } = useReservationStore();
  const isSelect = !!reservation.reservationData;
  const placeData = useLoaderData() as any;
  const userData = useAuthStore.getState().user;
  const reviewCount = placeData.expand['boards(placeId)']
    ? placeData.expand['boards(placeId)'].length
    : 0;

  // 문의하기
  const handleInquire = (e: MouseEvent) => {
    alert('정말 문의하시겠습니까?');

    createChatRoom(
      placeData.id,
      (userData as { [key: string]: any }).id,
      placeData.userId,
      '안녕하세요.'
    );
  };

  return (
    <>
      <SwiperProfile data={placeData} />
      <PlaceTitleSection
        review={
          placeData.expand['boards(placeId)']
            ? placeData.expand['boards(placeId)'].length
            : ''
        }
        address={placeData.address}
        title={placeData.title}
        tagList={placeData.tag}
        name={placeData.expand.userId.name}
      />
      <PlaceSection title="날짜 선택">
        <DatePick minDate={placeData.minDate} maxDate={placeData.maxDate} />
      </PlaceSection>
      <PlaceSection title="반려동물 선택">
        <AnimalPick />
      </PlaceSection>
      <PlaceSection title="이용 금액">
        <ServicePrice data={placeData} />
      </PlaceSection>
      <PlaceSection title="플레이스 위치">
        <PlaceLocation address={placeData.address} />
      </PlaceSection>
      <PlaceSection title="자기 소개">
        <PlaceIntroduce introduce={placeData.introduce} />
      </PlaceSection>
      <PlaceSection title="이용 가능 서비스">
        <ServiceCanUse placeData={placeData} />
      </PlaceSection>
      <PlaceSection title={`후기 ${reviewCount}개`}>
        <PlaceReview data={placeData} />
      </PlaceSection>
      <StyledButtonContainer>
        <Button size={'30%'} mode="chat" onClick={handleInquire}>
          문의
        </Button>
        <Button
          as={isSelect ? Link : null}
          size="65%"
          mode={isSelect ? 'normal' : 'disabled'}
          to={`/payment/${placeData.id}`}
          style={{ textAlign: 'center' }}
        >
          예약하기
        </Button>
      </StyledButtonContainer>
    </>
  );
};

export default PlaceDetail;
