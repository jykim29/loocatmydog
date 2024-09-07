import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

interface AuthorizationProps {
  redirectTo: string;
  withAuthorization: boolean | undefined;
  children: React.ReactNode;
}

const Authorization = ({
  redirectTo,
  withAuthorization,
  children,
}: AuthorizationProps) => {
  const userData = useAuthStore.getState().user;
  const isEdited = userData?.isEdited;

  // withAuthorization true : landing, signup, signin 페이지 접근
  // withAuthorization false : landing, signup, signin 이외의 페이지 접근
  if (withAuthorization) {
    if (userData && isEdited) {
      return <>{children}</>;
    } else {
      return <Navigate to={redirectTo} />;
    }
  } else {
    if (userData && isEdited) {
      return <Navigate to={redirectTo} />;
    } else {
      return <>{children}</>;
    }
  }
};

export default Authorization;
