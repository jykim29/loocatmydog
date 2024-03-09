import { queryClient } from '@/app/App';
import { HeaderProps } from '@/components/molecules/Header/Header';
import AddPet, { addPetFormAction } from '@/components/organisms/AddPet/AddPet';
import DatePick from '@/components/organisms/DatePick/DatePick';
import HeartList from '@/components/organisms/HeartList/HeartList';
import ModifyProfile from '@/components/organisms/ModifyProfile/ModifyProfile';
import MyPage from '@/components/organisms/MyPage/MyPage';
import Reservations from '@/components/organisms/Reservations/Reservations';
import Settings from '@/components/organisms/Settings/Settings';
import Stories from '@/components/organisms/Stories/Stories';
import StoryWrite, {
  storyFormAction,
} from '@/components/organisms/Stories/StoryWrite';
import Landing from '@/pages/Landing/Landing';
import PlaceDetail from '@/pages/PlaceDetail/PlaceDetail';
import { loader as detail } from '@/pages/PlaceDetail/loader';
import SignIn, { signInFormAction } from '@/pages/SignIn/SignIn';
import SignUp from '@/pages/SignUp/SignUp';
import { RouteObject } from 'react-router-dom';
import ChatRoom, {
  chatRoomFormAction,
} from '@/components/organisms/Chat/ChatRoom';

type NavigationRouteObject = RouteObject & {
  headerType?: [HeaderProps['type'], HeaderProps['title']];
};

export const navigationItems: NavigationRouteObject[] = [
  // 지우님
  {
    path: '/',
    element: <Landing />,
    index: true,
  },
  {
    path: '/signin',
    element: <SignIn />,
    action: signInFormAction,
    headerType: ['back', null],
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  // 종연님
  {
    path: '/main',
    async lazy() {
      const { loader, Component } = await import('@/pages/Main');
      return { loader: loader(queryClient), Component };
    },
    headerType: ['main', null],
  },
  {
    // query parameter 종류
    // filterType = range | mine | bookmark
    // filterType=range라면 => &startDate=yyMMdd&endDate=yyMMdd
    // sortType = distance | popular | price
    path: '/place_list',
    lazy: async () => import('@/pages/PlaceList/PlaceList'),
    headerType: ['main', null],
  },

  // 경화님
  {
    path: '/add_place',
    element: '',
    headerType: ['back', '플레이스 등록'],
  },
  {
    path: '/place_detail/:id',
    element: <PlaceDetail />,
    headerType: ['place', null],
    loader: detail,
  },
  {
    path: '/reservation_list/:id',
    element: '',
  },
  {
    path: '/reservation_done',
    element: '',
    headerType: ['popup', null],
  },

  // 종명님
  {
    path: '/stories',
    element: <Stories />,
    headerType: ['logo', null],
  },
  {
    path: '/stories/post',
    element: <StoryWrite />,
    headerType: ['popup', null],
    action: storyFormAction,
  },
  {
    path: '/reservation_list',
    element: <Reservations />,
    headerType: ['logo', null],
  },
  {
    path: '/chat_list',
    element: '',
    headerType: ['back', '채팅 목록'],
  },
  {
    path: '/chat_room',
    element: <ChatRoom />,
    headerType: ['back', '플레이스'],
    action: chatRoomFormAction,
  },

  // 다영님
  {
    path: '/mypage',
    element: (
      <>
        <MyPage />
      </>
    ),
    headerType: ['popup', '마이 페이지'],
  },
  {
    path: '/add_mypet',
    element: <AddPet />,
    headerType: ['back', '반려동물 추가'],
    action: addPetFormAction,
  },
  {
    path: '/edit_my_profile',
    element: <ModifyProfile />,
    headerType: ['back', '프로필 변경'],
  },
  {
    path: '/bookmark',
    element: <HeartList />,
    headerType: ['logo', null],
  },
  {
    path: '/settings',
    element: (
      <>
        <Settings />
      </>
    ),
    headerType: ['logo', null],
  },

  // 미할당
  {
    path: '/events',
    element: '',
    headerType: ['back', '이벤트 목록'],
  },
  {
    path: '/change_phone',
    element: '',
  },
  {
    path: '/change_address',
    element: '',
  },
];
