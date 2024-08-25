import styled from 'styled-components';
import Calendar from '@/components/atoms/Calendar/Calendar';

const StyledDatePick = styled.div`
  & p {
    ${(props) => props.theme.fontStyles.textSemiboldBase}
    color: ${(props) => props.theme.colors.textBlack};
    margin-bottom: 15px;
  }
  margin-bottom: 30px;
`;

const DatePick = ({ minDate, maxDate }: { minDate: Date; maxDate: Date }) => {
  return (
    <StyledDatePick>
      <Calendar isModal={true} minMaxDateRange={[minDate, maxDate]} />
    </StyledDatePick>
  );
};

export default DatePick;
