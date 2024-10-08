import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import pb from '@/api/pocketbase';
import PaymentCard from '@/components/molecules/PaymentCard/PaymentCard';
import ProfileCardRadioButton from '@/components/molecules/ProfileCard/ProfileCardRadioButton';
import ProfileListLink from '@/components/molecules/ProfileListLink/ProfileListLink';
import UserProfile from '@/components/molecules/UserProfile/UserProfile';
import { useAuthStore } from '@/store/useAuthStore';
import getPbImageURL from '@/utils/getPbImageURL';
import ProfileCard from '@/components/molecules/ProfileCard/ProfileCard';

const StyledMyPage = styled.div`
  display: flex;
  flex-direction: column;
  inline-size: 100%;
  padding-block-start: 20px;
  position: relative;

  & .petSpan {
    display: inline-block;
    inline-size: 100%;
    padding-block-start: 20px;
    margin-block: 16px;
    ${(props) => props.theme.fontStyles.textSemiboldMd}
    color:  ${(props) => props.theme.colors.textBlack}
  }
`;

const AddPetPlusBox = styled(Link)`
  position: absolute;
  right: 20px;
  top: 120px;

  & .addPetBtn {
    display: flex;
    flex-flow: row;
    cursor: pointer;
    ${(props) => props.theme.fontStyles.textSemiboldSm}
    color:  ${(props) => props.theme.colors.textDarkGray}
  }
`;

const ProfileCardSection = styled.div`
  padding-inline: 20px;
  padding-block-end: 25px;
`;
const ProfileCardList = styled.ul`
  display: flex;
  justify-content: space-between;
  inline-size: 100%;
  gap: 10px;
  flex-wrap: wrap;

  & li {
    flex: 1;
  }
`;
const PaymentPlusBox = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 20px 17px;
  & button {
    ${(props) => props.theme.fontStyles.textRegularSm};
    color: ${(props) => props.theme.colors.textDarkGray};
    display: flex;

    & img {
      padding-inline-start: 5px;
    }
  }
`;

export const MyPage = () => {
  const navigate = useNavigate();

  const handleProfileCardClick = () => {
    navigate('/add_mypet');
  };

  const user = useAuthStore.getState().user;
  const [petData, setPetData] = useState<any>(null);
  const avatarUrl =
    user && user.avatar !== ''
      ? getPbImageURL(user?.collectionId, user.id, user.avatar)
      : '/images/profileNone.svg';

  const petImage = useEffect(() => {
    const fetchPetData = async () => {
      const record = await pb.from('users').getOne(user?.id, {
        select: {
          expand: {
            petId: true,
          },
        },
      });

      setPetData(record.expand?.petId);
    };
    fetchPetData();
  }, [user]);

  return (
    <StyledMyPage>
      <UserProfile
        style={{ marginBlock: 35 }}
        name={user?.name}
        src={avatarUrl}
      />
      <ProfileCardSection>
        <span className="petSpan">반려동물</span>
        {petData && (
          <AddPetPlusBox to={'/add_mypet'}>
            <button className="addPetBtn">
              추가등록
              <img src="/images/miniPlusCircle.svg" alt="플러스" />
            </button>
          </AddPetPlusBox>
        )}

        <ProfileCardList>
          {!petData ? (
            <li>
              <ProfileCard onClick={handleProfileCardClick}>
                <span className="name">반려동물을 등록해주세요</span>
              </ProfileCard>
            </li>
          ) : (
            petData.map((data: any) => (
              <li key={data.id}>
                <ProfileCard
                  src={getPbImageURL(data.collectionId, data.id, data.image)}
                >
                  <span className="name">{data.petName}</span>
                  <span className="description">
                    {`${data.breed}, ${data.weight}kg`}
                  </span>
                </ProfileCard>
              </li>
            ))
          )}
        </ProfileCardList>
      </ProfileCardSection>
      <ProfileListLink />
      <ProfileListLink
        accordion={true}
        accordionContent={
          <>
            <PaymentCard
              style={{
                paddingInline: 20,
                paddingBlockStart: 6,
                paddingBlockEnd: 20,
              }}
              src={'/images/card.svg'}
              userPay={false}
              name={'test'}
            />
            <PaymentPlusBox>
              <button type="button">
                결제수단 추가등록
                <img src="/images/miniPlusCircle.svg" alt="추가 버튼" />
              </button>
            </PaymentPlusBox>
          </>
        }
      >
        {'결제수단'}
      </ProfileListLink>
      <ProfileListLink to={'/reservation_list'}>{'예약내역'}</ProfileListLink>
      <ProfileListLink to={'/settings'}>{'환경설정'}</ProfileListLink>
    </StyledMyPage>
  );
};
