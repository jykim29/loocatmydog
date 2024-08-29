import ReservationInfo from '@/components/organisms/ReservationInfo/ReservationInfo';
import { format } from 'date-fns';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button/Button';

const StyledReservationDone = styled.div`
  padding: 20px 0;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 30px;
  & .title {
    ${(props) => props.theme.fontStyles.headingMd};
    color: ${(props) => props.theme.colors.textBlack};
  }
`;

const ReservationDone = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  function handleClick() {
    return navigate('/main');
  }
  return (
    <StyledReservationDone>
      <div className="innerWrw">
        <p className="title">예약 완료!</p>
        <p className="dateInfo"></p>
        <p>플레이스와 함께하세요</p>
      </div>
      <ReservationInfo
        mindate={`${format(state.minDate, 'MM월 dd일')}`}
        maxdate={`${format(state.maxDate, 'MM월 dd일')}`}
        require={state.require}
        etc={state.etc}
      />
      <Button
        size="100%"
        mode="normal"
        style={{ marginTop: '30px' }}
        onClick={handleClick}
      >
        메인으로 돌아가기
      </Button>
    </StyledReservationDone>
  );
};

export default ReservationDone;
