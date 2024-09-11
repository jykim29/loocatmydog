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
import createChatRoom from '@/pages/ChatRoom/createChatRoom';
import { useAuthStore } from '@/store/useAuthStore';
import useDateRangeStore from '@/store/useDateRange';
import { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import styled from 'styled-components';

const StyledButtonContainer = styled.div`
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
`;

type InitialReservationFormState = {
  require: string;
  etc: string;
  petId: string;
};
const initialReservationFormState = {
  require: '',
  etc: '',
  petId: '',
};

export const PlaceDetail = () => {
  const { dateRange, resetDateRange } = useDateRangeStore();
  const [reservationForm, setReservationForm] =
    useState<InitialReservationFormState>(initialReservationFormState);
  const placeData = useLoaderData() as any;
  const userData = useAuthStore.getState().user;
  const reviewCount = placeData.expand['boards(placeId)']
    ? placeData.expand['boards(placeId)'].length
    : 0;
  const isValid =
    reservationForm.require.length > 0 && reservationForm.petId.length > 0;
  const handleChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget;
    setReservationForm((prev) => ({ ...prev, [name]: value }));
  };
  const resetInput = () => {
    setReservationForm(initialReservationFormState);
  };

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

  useEffect(() => {
    return () => resetDateRange();
  }, []);

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
        <AnimalPick
          reservationForm={reservationForm}
          onChange={handleChangeInput}
          resetInput={resetInput}
        />
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
          as={isValid ? Link : null}
          size="65%"
          mode={isValid ? 'normal' : 'disabled'}
          to={`/payment/${placeData.id}`}
          state={{ ...reservationForm, date: dateRange, userId: userData?.id }}
        >
          예약하기
        </Button>
      </StyledButtonContainer>
    </>
  );
};
