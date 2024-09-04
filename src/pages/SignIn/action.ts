import { redirect } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

// submit action 함수
export async function action({ request }: { request: any }) {
  const formData = await request.formData();

  const email = formData.get('email');
  const password = formData.get('password');

  try {
    await useAuthStore.getState().signIn(email, password);

    alert('로그인 성공');
    return redirect('/main');
  } catch (error) {
    console.log('로그인 실패 : ', error);
    alert('아이디, 비밀번호를 확인해주세요.');
    return null;
  }
}
