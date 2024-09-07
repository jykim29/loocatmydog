import styled from 'styled-components';

//type 선언
interface MyPlaceListProps {
  title: string;
  address: string;
  dDay?: string;
  src?: string;
  action: React.ReactNode;
}

//styled 컴포넌트

const StyledMyPlaceListContainer = styled.div<{ $dDay: string | undefined }>`
  inline-size: 100%;
  max-inline-size: 420px;
  display: flex;
  background: ${(props) =>
    props.$dDay === 'D-day' || props.$dDay === '이용중'
      ? props.theme.colors.orangeBg
      : 'none'};
  justify-content: space-between;
  align-items: center;
  column-gap: 7.5%;
  padding: 8px 10px;

  & .placeImage {
    inline-size: 24%;
    aspect-ratio: 1.26/1;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    & > img {
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
    }
  }
  .textWrap {
    ${(props) => props.theme.colors.textDarkGray};
    ${(props) => props.theme.fontStyles.textRegularSm};
    flex: 1;
  }
  .textWrap p {
    margin-bottom: 0.325rem;
    ${(props) => props.theme.colors.textBlack};
    ${(props) => props.theme.fontStyles.textSemiboldMd};
  }
`;

function MyPlaceList({
  title = '',
  address = '',
  dDay,
  src = '/images/story_sample3.jpg',
  action,
  ...restProps
}: MyPlaceListProps) {
  return (
    <StyledMyPlaceListContainer $dDay={dDay} {...restProps}>
      <figure className="placeImage">
        <img src={src} alt="플레이스사진" />
      </figure>

      <div className="textWrap">
        <p>{title}</p>
        <span>{address}</span>
      </div>
      {action}
    </StyledMyPlaceListContainer>
  );
}

export default MyPlaceList;
