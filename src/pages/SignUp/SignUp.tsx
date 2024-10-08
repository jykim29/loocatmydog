import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import pb from '@/api/pocketbase';
import SignUpAddress from '@/components/organisms/SignUp/SignUpAddress';
import SignUpAgree from '@/components/organisms/SignUp/SignUpAgree';
import SignUpEmail from '@/components/organisms/SignUp/SignUpEmail';
import SignUpPhone from '@/components/organisms/SignUp/SignUpPhone';
import { useAuthStore } from '@/store/useAuthStore';

interface FormData {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  birthday: string;
  genderNo: string;
  phone: string;
  address: string;
  addressDetail: string;
  zonecode: string;
  sigungu: string;
  latitude: string;
  longitude: string;
}

const INITIAL_DATA: FormData = {
  email: '',
  password: '',
  passwordConfirm: '',
  name: '',
  birthday: '',
  genderNo: '',
  phone: '',
  address: '',
  addressDetail: '',
  zonecode: '',
  sigungu: '',
  latitude: '',
  longitude: '',
};

export const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const socialLoginData = location.state?.data;

  // 데이터 저장을 위한 상태관리
  const [data, setData] = useState(INITIAL_DATA);
  // 현재 화면에 보이는 컴포넌트 조절을 위한 상태관리
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (socialLoginData) {
      setCurrentStepIndex(2);
      setData((prev) => {
        return { ...prev, email: socialLoginData.record.email };
      });
    }
  }, [socialLoginData]);

  // 회원가입 다음 단계로 이동 시 데이터 업데이트
  function updateFields(fields: Partial<FormData>) {
    setData((prev) => {
      return { ...prev, ...fields };
    });
  }

  // 다음단계로 가는 버튼 클릭 시 실행
  function next() {
    setCurrentStepIndex((i) => {
      if (i >= steps.length - 1) return i;
      return i + 1;
    });
  }

  // 상단의 뒤로가기 버튼 클릭 시 실행
  function back() {
    setCurrentStepIndex((i) => {
      if (i <= 0) return i;
      return i - 1;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const userData = {
      email: data.email,
      emailVisibility: true,
      password: data.password,
      passwordConfirm: data.password,
      name: data.name,
      birthday: data.birthday,
      genderNo: data.genderNo,
      phone: data.phone,
      address: data.address,
      addressDetail: data.addressDetail,
      addressInfo: {
        zonecode: data.zonecode,
        sigungu: data.sigungu,
        latitude: data.latitude,
        longitude: data.longitude,
      },
      isEdited: true,
    };
    try {
      if (socialLoginData) {
        await pb
          .collection('users')
          .update(socialLoginData.record.id, userData);
        await useAuthStore.getState().update();
        alert('회원가입을 완료했습니다.');
      } else {
        await pb.collection('users').create(userData);
        await useAuthStore.getState().signIn(data.email, data.password);
        alert('회원가입을 완료했습니다.');
      }
      navigate('/main');
    } catch (error) {
      console.log('데이터 통신 중 에러가 발생했습니다. : ', error);
    }
  }
  const steps = [
    <SignUpAgree {...data} next={next} back={back} key="signUpAgree" />,
    <SignUpEmail
      {...data}
      next={next}
      back={back}
      updateFields={updateFields}
      key="signUpEmail"
    />,
    <SignUpPhone
      {...data}
      next={next}
      back={back}
      updateFields={updateFields}
      key="signUpPhone"
    />,
    <SignUpAddress
      {...data}
      next={next}
      back={back}
      updateFields={updateFields}
      key="signUpAddress"
    />,
  ];

  return (
    <form onSubmit={(e) => handleSubmit(e)}>{steps[currentStepIndex]}</form>
  );
};
