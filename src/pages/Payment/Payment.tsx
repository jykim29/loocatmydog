import { useEffect, useState } from 'react';
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { differenceInCalendarDays, format } from 'date-fns';
import { RequestPayParams, RequestPayResponse } from 'iamport-typings';
import pb from '@/api/pocketbase';
import Button from '@/components/atoms/Button/Button';
import CheckBox from '@/components/atoms/CheckBox/CheckBox';
import PaymentMethodRadioButton from '@/components/molecules/PaymentMethodButton/PaymentMethodRadioButton';
import ReservationInfo from '@/components/organisms/ReservationInfo/ReservationInfo';
import { useAuthStore } from '@/store/useAuthStore';
import { maskingName } from '@/utils';

//style지정
const StyledPaymentContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.colors.gray100};
  & .title {
    ${(props) => props.theme.fontStyles.headingMd}
    color: ${(props) => props.theme.colors.textBlack};
  }
  & .info {
    ${(props) => props.theme.fontStyles.textRegularMd};
    color: ${(props) => props.theme.colors.textDarkGray};
  }
  & .innerWrapper {
    background: #fff;
    padding: 20px 20px 30px;
    margin-bottom: 20px;
  }
  & .borderLine {
    block-size: 1px;
    inline-size: 100%;
    margin: 20px 0;
    background: ${(props) => props.theme.colors.lineColorGray};
  }
  & .payInfo {
    display: flex;
    justify-content: space-between;
    ${(props) => props.theme.fontStyles.textSemiboldBase};
    color: ${(props) => props.theme.colors.textBlack};
  }
  & .innerTitle {
    ${(props) => props.theme.fontStyles.textSemiboldBase};
    color: ${(props) => props.theme.colors.textBlack};
    & > span {
      ${(props) => props.theme.fontStyles.textSemiboldBase}
      color: ${(props) => props.theme.colors.orange}
    }
  }
  & .orange {
    color: ${(props) => props.theme.colors.orange};
  }
  & .infoDetail li {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    ${(props) => props.theme.fontStyles.textRegularBase}
    & .price {
      ${(props) => props.theme.fontStyles.textSemiboldBase}
    }
  }
  & label span {
    ${(props) => props.theme.fontStyles.textSemiboldBase}
    padding-inline-start: 10px;
  }
  & .agreeInfo li {
    margin-bottom: 10px;
    ${(props) => props.theme.fontStyles.textRegularMd}
    color: ${(props) => props.theme.colors.textDarkGray};
  }
  & .payments {
    display: flex;
    gap: 10px;
  }
`;
const StyledBanner = styled.div`
  background: url('/images/paymentBanner.jpg') no-repeat 50% 50% / cover;
  inline-size: 100%;
  block-size: 90px;
`;

interface PgItem {
  id: number;
  label: RequestPayParams['pay_method'];
  kor_label: string;
  name: RequestPayParams['pg'];
  imageSrc: string;
}

const pgList: PgItem[] = [
  {
    id: 0,
    label: 'kakaopay',
    kor_label: '카카오페이',
    name: `kakaopay.${import.meta.env.VITE_PORTONE_KAKAOPAY_STORE_ID}`,
    imageSrc: '/images/payments/kakaopay_icon.png',
  },
  {
    id: 1,
    label: 'tosspay',
    kor_label: '토스페이',
    name: 'tosspay',
    imageSrc: '/images/payments/tosspay_icon.png',
  },
];

export const Payment = () => {
  const placeData = useLoaderData() as any;
  const { state } = useLocation();
  const userData = useAuthStore.getState().user;
  const [pgItem, setPgItem] = useState<PgItem>(pgList[0]);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const petData = userData?.expand.petId.find(
    (value: any) => value.id === state.petId
  );
  let currentPrice = placeData.priceSmall;
  let currentWeight = '소형';
  if (petData.weight >= 7 && petData.weight < 15) {
    currentPrice = placeData.priceMiddle;
    currentWeight = '중형';
  }
  if (petData.weight >= 15) {
    currentPrice = placeData.priceLarge;
    currentWeight = '대형';
  }
  const differenceDays =
    differenceInCalendarDays(state.date[1], state.date[0]) + 1;
  const totalPrice = currentPrice * differenceDays;

  const handleClickRequestPay = () => {
    alert('handleClickRequestPay 호출');
    if (!window.IMP) return;
    if (!isChecked) return;

    const { IMP } = window;
    IMP.init(import.meta.env.VITE_PORTONE_STORE_CODE);
    const data: RequestPayParams = {
      pg: pgItem.name,
      pay_method: 'card',
      merchant_uid: `order_${crypto.randomUUID()}`,
      name: `테스트 결제: ${placeData.title}`,
      amount: totalPrice, // 가격
      buyer_name: userData?.name,
      buyer_tel: userData?.phone,
      buyer_email: userData?.email,
      buyer_addr: `${userData?.address} ${userData?.addressDetail}`,
      m_redirect_url: `${location.href}/progress`,
    };

    IMP.request_pay(data, callback);
    alert('결제요청함');
  };

  const callback = async (response: RequestPayResponse) => {
    const { success, error_msg } = response;
    if (success) {
      const userData = useAuthStore.getState().user;
      const reservationData = {
        placeId: placeData.id,
        userId: userData?.id,
        petId: state.petId,
        minDate: state.date[0],
        maxDate: state.date[1],
        reviewed: false,
        price: placeData.priceSmall,
        required: state.require,
        etc: state.etc,
      };

      await pb.collection('reservation').create(reservationData);

      alert('결제 성공');
      return navigate(`/reservation_done/${placeData.id}`, {
        replace: true,
        state: {
          minDate: state.date[0],
          maxDate: state.date[1],
          require: state.require,
          etc: state.etc,
        },
      });
    } else {
      alert(`결제 실패: ${error_msg}`);
    }
  };
  //checkbox handler
  const handleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  const handleChangePayment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    const pgItem = pgList.find((item) => item.label === value);
    if (!pgItem) return;
    setPgItem(pgItem);
  };

  useEffect(() => {
    const iamport = document.createElement('script');
    iamport.src = 'https://cdn.iamport.kr/v1/iamport.js';
    document.head.appendChild(iamport);
    return () => {
      document.head.removeChild(iamport);
    };
  }, []);
  return (
    <StyledPaymentContainer>
      <StyledBanner />
      <div className="innerWrapper">
        <p className="title">{placeData.title}</p>
        <span className="info">
          {placeData.address} {maskingName(placeData.expand.userId.name)}
        </span>
        <div className="borderLine"></div>
        <ReservationInfo
          mindate={format(state.date[0], 'MM월 dd일')}
          maxdate={format(state.date[1], 'MM월 dd일')}
          require={state.require}
          etc={state.etc}
        />
      </div>
      <div className="innerWrapper">
        <ul className="infoDetail">
          <li>
            <span>예약자 성함</span>
            <span className="price">{userData?.name}</span>
          </li>
          <li>
            <span>반려 동물</span>
            <span className="price">{petData.petName}</span>
          </li>
          <li>
            <span>연락처</span>
            <span className="price">{userData?.phone}</span>
          </li>
        </ul>
      </div>
      <div className="innerWrapper">
        <p className="innerTitle">
          결제 수단 - <span>{pgItem.kor_label}</span>
        </p>
        <div className="borderLine"></div>
        <div className="payments">
          {pgList.map((pgItem) => (
            <PaymentMethodRadioButton
              key={pgItem.id}
              pgImageSrc={pgItem.imageSrc}
              value={pgItem.label}
              onChange={handleChangePayment}
              defaultChecked={pgItem.id === 0}
            />
          ))}
        </div>
        <div className="borderLine" style={{ margin: '20px 0 0 0' }}></div>
      </div>
      <div className="innerWrapper">
        <div className="payInfo">
          <p>총 금액</p>
          <p className="orange">{totalPrice.toLocaleString('ko-KR')} 원</p>
        </div>
        <div className="borderLine"></div>
        <ul className="infoDetail">
          <li>
            <span>{`${currentWeight} 1마리 x ${differenceDays}일`}</span>
            <span className="price">
              {totalPrice.toLocaleString('ko-KR')} 원
            </span>
          </li>
        </ul>
      </div>
      <div className="innerWrapper" style={{ marginBottom: '0px' }}>
        <CheckBox isChecked={isChecked} onChange={handleCheckbox}>
          환불 규정 동의
        </CheckBox>
        <div className="borderLine"></div>
        <ul className="agreeInfo">
          <li>예약 시작 72시간 전까지: 100% 환불</li>
          <li>예약 시작 24-72시간 전까지: 50% 환불</li>
          <li>예약 시작 24시간 이내: 환불 불가</li>
        </ul>
        <Button
          size="100%"
          mode={isChecked ? 'normal' : 'disabled'}
          onClick={handleClickRequestPay}
        >
          결제하기
        </Button>
      </div>
    </StyledPaymentContainer>
  );
};
