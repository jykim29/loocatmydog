import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { eq } from 'typed-pocketbase';
import pb from '@/api/pocketbase';
import ButtonPlus from '@/components/atoms/ButtonPlus/ButtonPlus';
import StoryCard from '@/components/molecules/StoryCard/StoryCard';
import Tab from '@/components/molecules/Tab/Tab';
import { useAuthStore } from '@/store/useAuthStore';
import getPbImageURL from '@/utils/getPbImageURL';

interface Expand {
  [key: string]: any;
}

const StyledStoriesContainer = styled.div`
  inline-size: 100%;
`;

const EmptyGuideText = styled.p`
  text-align: center;
  padding-block: 20px;
  font-size: ${(props) => props.theme.fontSizes.headTitle};
  font-weight: ${(props) => props.theme.fontWeight.medium};
`;

const tabMenuList = ['전체', '내 스토리'];

export const Stories = () => {
  // 로그인 유저 정보
  const currentUserData = useAuthStore.getState().user;
  const currentUserId = currentUserData?.id;
  // 스토리 데이터
  const [stories, setStories] = useState<{ [key: string]: any }[]>([]);
  // 탭 메뉴 상태
  const [tabValue, setTabValue] = useState<string>(tabMenuList[0]);

  const filteredStories = useMemo(() => {
    if (tabValue === '내 스토리')
      return stories.filter((story) => story.userId === currentUserId);
    return stories;
  }, [stories, tabValue, currentUserId]);

  // 탭 변경 이벤트
  const handleChangeTab = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setTabValue(value);
  };

  useEffect(() => {
    const getStories = async () => {
      try {
        const response = await pb.from('boards').getFullList({
          sort: '-created',
          filter: eq('type', 'stories'),
          select: {
            expand: {
              userId: true,
            },
          },
          requestKey: null,
        });
        const newResponse = response.map((data) => {
          const { id, collectionId, expand, photo } = data;
          const expandUserData = expand ? expand.userId : null;
          let profileImage = '/images/profileNone.svg';
          if (expandUserData && expandUserData.avatar !== '') {
            profileImage = getPbImageURL(
              expandUserData.collectionId,
              expandUserData.id,
              expandUserData.avatar
            );
          }
          const imageUrls = photo.map((url: string) =>
            getPbImageURL(collectionId, id, url, '640x0')
          );
          return {
            ...data,
            photo: imageUrls,
            expand: {
              ...data.expand,
              userId: data.expand
                ? {
                    ...data.expand.userId,
                    avatar: profileImage,
                  }
                : null,
            },
            profileImageUrl: profileImage,
          };
        });

        return newResponse;
      } catch (error) {
        console.log('///// Server Error: ', error);
      }
    };
    getStories()
      .then((res) => {
        if (res) setStories(res);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Tab
        currentTab={tabValue}
        menuList={tabMenuList}
        onChange={handleChangeTab}
      />
      <StyledStoriesContainer>
        {filteredStories.length > 0 ? (
          filteredStories.map(
            ({ id, userId, expand, type, textContent, created, photo }) => {
              return (
                <StoryCard
                  key={id}
                  id={id}
                  userId={userId}
                  username={expand.userId.name}
                  profileImageUrl={expand.userId.avatar}
                  type={type}
                  text={textContent}
                  createdDate={created}
                  attachImageUrl={photo}
                />
              );
            }
          )
        ) : (
          <EmptyGuideText>표시할 스토리가 없습니다.</EmptyGuideText>
        )}
      </StyledStoriesContainer>
      <ButtonPlus path={'/stories/post'} />
    </>
  );
};
