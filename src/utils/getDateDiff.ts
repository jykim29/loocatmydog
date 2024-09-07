import { differenceInCalendarDays } from 'date-fns';

const getDateDiff = (minDate: Date, maxDate: Date) => {
  // 현재 날짜와 시작 날짜 차이
  const gapUntilStartDate = differenceInCalendarDays(new Date(), minDate);
  // 현재 날짜와 끝 날짜 차이
  const gapUntilEndDate = differenceInCalendarDays(new Date(), maxDate);

  // 시작 날짜와 일 수 차이
  if (gapUntilStartDate < 0) {
    return `D-${gapUntilStartDate}`;
  } else if (gapUntilStartDate === 0) {
    return 'D-day';
  } else if (gapUntilStartDate > 0 && gapUntilEndDate <= 0) {
    return '이용중';
  } else if (gapUntilEndDate > 0) {
    return 'past';
  }
};

export default getDateDiff;
