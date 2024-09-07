import HeartButton from '@/components/atoms/HeartButton/HeartButton';
import MyPlaceList from '@/components/molecules/MyPlaceList/MyPlaceList';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledHeartListBox = styled.div`
  display: flex;
  flex-flow: column;
`;

const StyledHeartItem = styled(Link)`
  &:hover {
    background-color: ${(props) => props.theme.colors.orangeBg};
    text-decoration: none;
  }
`;
interface HeartListProps {
  data: {
    [key: string]: any;
  };
}

const HeartList = ({ data }: HeartListProps) => {
  return (
    <StyledHeartListBox>
      {data?.map((item: any) => (
        <StyledHeartItem key={item.id} to={`/place_detail/${item.id}`}>
          <MyPlaceList
            src={item.photo}
            title={item.title}
            address={item.address}
            action={<HeartButton id={item.id} />}
          />
        </StyledHeartItem>
      ))}
    </StyledHeartListBox>
  );
};

export default HeartList;
