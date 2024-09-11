import { RouteObject } from 'react-router-dom';
import { queryClient } from '@/app/App';
import { HeaderProps } from '@/components/molecules/Header/Header';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';

type NavigationRouteObject = RouteObject & {
  headerType?: [HeaderProps['type'], HeaderProps['title']];
  withAuthorization: boolean;
};

export const navigationItems: NavigationRouteObject[] = [
  // 지우님
  {
    path: '/',
    lazy: () => import('@/pages/Landing/Landing'),
    index: true,
    withAuthorization: false,
  },
  {
    path: '/signin',
    async lazy() {
      const { SignIn: Component, action } = await import('@/pages/SignIn');
      return { Component, action };
    },
    headerType: ['back', null],
    withAuthorization: false,
  },
  {
    path: '/signup',
    async lazy() {
      const { SignUp: Component } = await import('@/pages/SignUp/SignUp');
      return { Component };
    },
    withAuthorization: false,
  },
  // 종연님
  {
    path: '/main',
    async lazy() {
      const { loader, Component } = await import('@/pages/Main');
      return {
        loader: loader(queryClient, ['places', 'main', 'all']),
        Component,
      };
    },
    headerType: ['main', null],
    withAuthorization: true,
  },
  {
    path: '/place_list',
    async lazy() {
      const { Component, loader } = await import('@/pages/PlaceList');
      return {
        loader: loader(queryClient, ['places', 'search', 'all', '', 'all']),
        Component,
      };
    },
    headerType: ['back', '플레이스 찾기'],
    withAuthorization: true,
  },

  {
    path: '/myplace_list',
    async lazy() {
      const { Component, loader } = await import('@/pages/MyPlaces');
      return { Component, loader };
    },
    headerType: ['back', '나의 플레이스'],
    withAuthorization: true,
  },

  // 경화님
  {
    path: '/add_place',
    async lazy() {
      const { AddPlace: Component, action } = await import('@/pages/AddPlace');
      return { Component, action };
    },
    headerType: ['back', '플레이스 등록'],
    withAuthorization: true,
  },
  {
    path: '/place_detail/:id',
    async lazy() {
      const { PlaceDetail: Component, loader } = await import(
        '@/pages/PlaceDetail'
      );
      return { Component, loader };
    },
    headerType: ['place', null],
    withAuthorization: true,
  },
  {
    path: '/payment/:id',
    async lazy() {
      const { loader } = await import('@/pages/PlaceDetail');
      const { Payment: Component } = await import('@/pages/Payment/Payment');
      return { Component, loader };
    },
    withAuthorization: true,
  },
  {
    path: '/payment/:id/progress',
    async lazy() {
      const { PaymentProgress: Component } = await import(
        '@/pages/Payment/PaymentProgress'
      );
      return { Component };
    },
    withAuthorization: true,
  },
  {
    path: '/reservation_done/:id',
    async lazy() {
      const { ReservationDone: Component } = await import(
        '@/pages/ReservationDone/ReservationDone'
      );
      return { Component };
    },
    headerType: ['popup', null],
    withAuthorization: true,
  },

  // 종명님
  {
    path: '/stories',
    async lazy() {
      const { Stories: Component } = await import('@/pages/Stories/Stories');
      return { Component };
    },
    headerType: ['logo', null],
    withAuthorization: true,
  },
  {
    path: '/stories/post',
    async lazy() {
      const { StoryWrite: Component, storyFormAction: action } = await import(
        '@/pages/StoriesWrite/StoryWrite'
      );
      return { Component, action };
    },
    headerType: ['popup', null],
    withAuthorization: true,
  },
  {
    path: '/review/post/:id',
    async lazy() {
      const { StoryWrite: Component, storyFormAction: action } = await import(
        '@/pages/StoriesWrite/StoryWrite'
      );
      return { Component, action };
    },
    headerType: ['popup', null],
    withAuthorization: true,
  },
  {
    path: '/reservation_list',
    lazy: () => import('../pages/Reservations/Reservations'),
    headerType: ['logo', null],
    withAuthorization: true,
  },
  {
    path: '/chat_list',
    async lazy() {
      const { ChatList: Component } = await import('@/pages/ChatList/ChatList');
      return { Component };
    },
    headerType: ['back', '채팅 목록'],
    withAuthorization: true,
  },
  {
    path: '/chat_room/:id',
    async lazy() {
      const { ChatRoom: Component } = await import('@/pages/ChatRoom/ChatRoom');
      return { Component };
    },
    headerType: ['back', '플레이스'],
    // action: chatroomFormAction,
    withAuthorization: true,
  },

  // 다영님
  {
    path: '/mypage',
    async lazy() {
      const { MyPage: Component } = await import('@/pages/MyPage/MyPage');
      return { Component };
    },
    headerType: ['popup', '마이 페이지'],
    withAuthorization: true,
  },
  {
    path: '/add_mypet',
    async lazy() {
      const { AddPet: Component, addPetFormAction: action } = await import(
        '@/pages/AddPet/AddPet'
      );
      return { Component, action };
    },
    headerType: ['back', '반려동물 추가'],
    withAuthorization: true,
  },
  {
    path: '/edit_my_profile',
    async lazy() {
      const { ModifyProfile: Component, modifyProfileAction: action } =
        await import('@/pages/ModifyProfile/ModifyProfile');
      return { Component, action };
    },
    headerType: ['back', '프로필 변경'],
    withAuthorization: true,
  },
  {
    path: '/bookmark',
    async lazy() {
      const { Component, loader } = await import('@/pages/HeartPlaces');
      return { Component, loader };
    },
    headerType: ['logo', null],
    withAuthorization: true,
  },
  {
    path: '/settings',
    async lazy() {
      const { Settings: Component } = await import('@/pages/Settings/Settings');
      return { Component };
    },
    headerType: ['logo', null],
    withAuthorization: true,
  },
  {
    path: '/*',
    element: <NotFoundPage />,
    withAuthorization: false,
  },
  // 미할당
  {
    path: '/events',
    element: '',
    headerType: ['back', '이벤트 목록'],
    withAuthorization: true,
  },
  {
    path: '/change_phone',
    element: '',
    withAuthorization: true,
  },
  {
    path: '/change_address',
    element: '',
    withAuthorization: true,
  },
];
