import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { eq } from 'typed-pocketbase';
import pb from '@/api/pocketbase';
import DateList from '@/components/atoms/DateList/DateList';
import MyPlaceList from '@/components/molecules/MyPlaceList/MyPlaceList';
import Tab from '@/components/molecules/Tab/Tab';
import { useAuthStore } from '@/store/useAuthStore';
import convertDate from '@/utils/convertDate';
import getDateDiff from '@/utils/getDateDiff';
import getPbImageURL from '@/utils/getPbImageURL';

const StyledReservations = styled.div`
  inline-size: 100%;
  block-size: 100%;

  & h2 {
    margin: 30px 20px 15px;
  }

  & a {
    text-decoration: none;
  }

  & a:hover {
    text-decoration: none;
  }

  & li:hover {
    background-color: ${(props) => props.theme.colors.gray100};
  }

  .line {
    inline-size: 100%;
    block-size: 0px;
    border: 1px solid;
    border-color: ${(props) => props.theme.colors.gray100};
  }

  .nullTemplate {
    inline-size: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    padding: 100px 52px;
    gap: 8px;

    & b {
      ${(props) => props.theme.fontStyles.headingMd}
    }
    & span {
      color: ${(props) => props.theme.colors.primary};
      ${(props) => props.theme.fontStyles.textRegularMd}
    }

    & a {
      background-color: ${(props) => props.theme.colors.primary};
      inline-size: 196px;
      block-size: 42px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 21px;
      margin: 16px;
      text-decoration: none;
    }

    & a:hover {
      background-color: ${(props) => props.theme.colors.orange};
      text-decoration: none;
    }
  }
`;

const tabMenuList = ['진행 예약', '지난 예약'];

export const Component = () => {
  // 로그인 유저 정보
  const currentUserData = useAuthStore.getState().user;
  const currentUserId = currentUserData?.id;
  const [tabValue, setTabValue] = useState(tabMenuList[0]);
  const [reservations, setReservations] = useState<{ [key: string]: any }[]>(
    []
  );
  const filteredReservations = useMemo(() => {
    if (tabValue === '지난 예약') {
      console.log(
        reservations.filter(
          (item) => getDateDiff(item.minDate, item.maxDate) === 'past'
        )
      );
      return reservations.filter(
        (item) => getDateDiff(item.minDate, item.maxDate) === 'past'
      );
    }
    return reservations;
  }, [tabValue, reservations]);
  const navigate = useNavigate();
  const handleChangeTab = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setTabValue(value);
  };

  useEffect(() => {
    const getReservations = async () => {
      try {
        const response = await pb.from('reservation').getFullList({
          select: {
            expand: {
              placeId: true,
              userId: true,
            },
          },
          filter: eq('userId', currentUserId),
          requestKey: null,
        });
        return response;
      } catch (error) {
        console.log(error);
      }
    };
    getReservations().then((res) => {
      if (res) setReservations(res);
    });
  }, []);

  return (
    <StyledReservations>
      <h2>예약 내역</h2>
      <Tab
        menuList={tabMenuList}
        currentTab={tabValue}
        onChange={handleChangeTab}
      ></Tab>
      <ul>
        {filteredReservations.length > 0 ? (
          filteredReservations.map(
            ({ id, placeId, minDate, maxDate, reviewed, expand }) => {
              const placeData = expand.placeId;
              const dDayText = getDateDiff(
                new Date(minDate),
                new Date(maxDate)
              );
              const placeImageUrl = getPbImageURL(
                placeData.collectionId,
                placeData.id,
                placeData.photo[0],
                '500x0'
              );
              const badgeState = reviewed ? '후기보기' : '후기쓰기';
              return (
                <MyPlaceList
                  key={id}
                  title={placeData.title}
                  address={placeData.address}
                  dDay={dDayText}
                  src={placeImageUrl}
                  action={
                    <DateList
                      mode={'fill'}
                      dDay={dDayText}
                      state={badgeState}
                      review={true}
                      date={convertDate(new Date(minDate))}
                      onClick={() => {
                        if (!reviewed) navigate(`/review/post/${placeId}`);
                      }}
                    />
                  }
                />
              );
            }
          )
        ) : (
          <div className="nullTemplate">
            <b>아직 예약이 없습니다</b>
            <span>지금 바로 봐주개냥을 이용해보세요.</span>
            <Link to={'/place_list'}>예약하기</Link>
          </div>
        )}
      </ul>
    </StyledReservations>
  );
};

Component.displayName = 'Reservations';
