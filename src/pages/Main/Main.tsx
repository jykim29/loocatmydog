import { useCallback, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLoaderData } from 'react-router-dom';
import styled from 'styled-components';
import { useInView } from 'framer-motion';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { queryClient } from '@/app/App';
import A11yHidden from '@/components/A11yHidden/A11yHidden';
import DropDown from '@/components/atoms/DropDown/DropDown';
import MoreButton from '@/components/atoms/MoreButton/MoreButton';
import HotPlace from '@/components/molecules/HotPlace/HotPlace';
import ContentSwiperContainer from '@/components/molecules/ImageSwiper/ContentSwiperContainer';
import ImageSwiperContainer from '@/components/molecules/ImageSwiper/ImageSwiperContainer';
import PetSpinner from '@/components/molecules/LoadingSpinner/PetSpinner';
import Place from '@/components/molecules/Place/Place';
import ShortcutMenu from '@/components/molecules/ShortcutMenu/ShortcutMenu';
import SideMenu from '@/components/organisms/SideMenu/SideMenu';
import usePlaceSort, {
  InitialSortType,
  initialState as initialSortItems,
} from '@/hooks/usePlaceSort';
import useDateRangeStore from '@/store/useDateRange';
import useModalControlStore from '@/store/useModalControl';
import {
  getPlaceInfiniteQueryOptions,
  getPlaceQueryOptions,
  setDailyPopup,
} from '@/utils';
import * as S from './StyledMain';

const shortcutMenuObject = [
  {
    path: '/place_list',
    title: '예약하기',
    description: '필요한 공간을 찾아보세요.',
    photo: '/images/sidemenu/sidebar_dog_small.png',
  },
  {
    path: '/stories',
    title: '스토리',
    description: '다른 친구들의 이야기',
    photo: '/images/place-ex.jpg',
  },
];

const StyledTopButton = styled.div`
  position: sticky;
  bottom: 50px;
  z-index: 10;

  & > button {
    display: block;
    width: 50px;
    height: 50px;
    padding-top: 10px;
    border-radius: 50%;
    background-color: ${(props) => props.theme.colors.orange};
    background-image: url('/images/arrow/arrowUp.svg');
    background-repeat: no-repeat;
    background-position: center 8px;
    background-size: 15px;
    color: ${(props) => props.theme.colors.white};
    border: 2px solid ${(props) => props.theme.colors.orange};
    margin-left: auto;
    margin-right: 15px;
    transition: all 0.3s;
    &:hover {
      background-color: ${(props) => props.theme.colors.white};
      color: ${(props) => props.theme.colors.orange};
    }
  }
`;

export function Component() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inViewRef = useRef(null);
  const isInView = useInView(inViewRef, { amount: 0.8 });
  const { resetDateRange } = useDateRangeStore();
  const { isShowModal, resetModal } = useModalControlStore();
  const { sortOptions, setSortOptions, sortString } = usePlaceSort();
  // loader 데이터 불러오기
  const { placeData: loadedPlaceData, imageUrlArray: loadedSwiperImageUrl } =
    useLoaderData() as any;
  // sortOptions에 따라 변하는 쿼리 키
  const queryKey = useMemo(
    () => ['places', 'main', sortOptions.id],
    [sortOptions.id]
  );

  // 전체 플레이스 리스트 인피니트 쿼리

  const {
    data: cachedPlaceAllData,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    ...getPlaceInfiniteQueryOptions(queryKey, 3, {
      sort: sortString,
    }),
  });
  const placeListData = cachedPlaceAllData
    ? cachedPlaceAllData.pages.flatMap((data) => data.items)
    : [];

  // 인기 플레이스 리스트 쿼리
  const { data: cachedPlacePopularData } = useQuery({
    ...getPlaceQueryOptions(['places', 'main', 'swiper']),
  });
  const placePopularData = cachedPlacePopularData
    ? cachedPlacePopularData.slice(0, 6)
    : [];

  const hotPlaceContents = placePopularData?.map((item) => {
    const shortAddress = item.address.split(' ').slice(0, 2).join(' ');
    return (
      <Link key={item.id} to={`/place_detail/${item.id}`}>
        <HotPlace
          src={item.photo[0]}
          title={item.title}
          rate={item.averageStar}
          reviewNumber={item.reviewCount}
          address={shortAddress}
        />
      </Link>
    );
  });
  const handleChangeSortType = useCallback(({ id, label }: InitialSortType) => {
    setSortOptions({ id, label });
  }, []);

  useEffect(() => {
    setDailyPopup();
    return () => {
      resetDateRange();
      resetModal();
    };
  }, []);

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        fetchNextPage();
      }, 300);
    }
  }, [isInView]);

  useEffect(() => {
    queryClient.resetQueries({ queryKey: queryKey });
  }, [queryKey]);
  return (
    <S.MainContainer ref={containerRef}>
      <A11yHidden as="h2" className="section-title">
        이벤트 배너
      </A11yHidden>
      <ImageSwiperContainer imageUrls={loadedSwiperImageUrl} type="link" />

      <S.MainSection $flexDirection="row" $flexGap={10}>
        <h2 className="section-title">
          <span>봐주개냥 서비스</span>
        </h2>
        <div className="section-content">
          {shortcutMenuObject.map((item) => (
            <ShortcutMenu
              key={item.path}
              path={item.path}
              title={item.title}
              description={item.description}
              photo={item.photo}
            />
          ))}
        </div>
      </S.MainSection>

      <S.MainSection>
        <h2 className="section-title">
          <span>인기 플레이스</span>
          <MoreButton path="/place_list" />
        </h2>
        <ContentSwiperContainer
          contents={hotPlaceContents as React.JSX.Element[]}
          swiperParams={{
            direction: 'horizontal',
            'slides-per-view': 1.6,
            'space-between': 20,
            'free-mode': true,
          }}
        />
      </S.MainSection>

      <S.MainSection $flexDirection="column" $flexGap={40}>
        <h2 className="section-title">
          <span>플레이스 찾기</span>
          <DropDown
            items={initialSortItems}
            setCurrent={handleChangeSortType}
          />
        </h2>
        <div className="section-content">
          {placeListData?.map((item) => {
            const shortAddress = item.address.split(' ').slice(0, 2).join(' ');
            return (
              <Place
                id={item.id}
                key={item.id}
                path={`/place_detail/${item.id}`}
                src={item.photo}
                title={item.title}
                rate={item.averageStar}
                reviewNumber={item.reviewCount}
                address={shortAddress}
                price={item.priceSmall}
                isActive={true}
              />
            );
          })}
        </div>
      </S.MainSection>
      {hasNextPage ? (
        <PetSpinner ref={inViewRef} />
      ) : (
        <div ref={inViewRef} role="none"></div>
      )}
      {isShowModal.sideMenu &&
        createPortal(<SideMenu />, document.getElementById('modal')!)}
      <StyledTopButton>
        <button
          type="button"
          onClick={() => {
            if (!containerRef.current?.parentElement) return;
            containerRef.current.parentElement.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
          }}
        >
          TOP
        </button>
      </StyledTopButton>
    </S.MainContainer>
  );
}
Component.displayName = 'Main';
