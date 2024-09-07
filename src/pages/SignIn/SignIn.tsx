import { useState } from 'react';
import { Form } from 'react-router-dom';
import styled from 'styled-components';
import Button from '@/components/atoms/Button/Button';
import FormInput from '@/components/molecules/FormInput/FormInput';
import { isEmail, isValidPassword } from '@/utils/signUpValidation';

const StyledSignIn = styled.div`
  padding-inline: 20px;
  padding-block-start: 45px;

  & .p-signIn {
    margin-block-end: 5px;
    ${(props) => props.theme.fontStyles.headingMd}
    color: ${(props) => props.theme.colors.textBlack}
  }

  & .formInputWrapper {
    margin-block-start: 30px;
    position: relative;

    & .span-error {
      position: absolute;
      top: -15px;
      right: 0;
      ${(props) => props.theme.fontStyles.textRegularSm}
      color: ${(props) => props.theme.colors.red}
    }
  }

  & button {
    margin-block-start: 50px;
  }
`;

export const SignIn = () => {
  const [inputValue, setInputValue] = useState({
    email: '',
    password: '',
  });
  const [isValid, setIsValid] = useState({
    email: false,
    password: false,
  });
  const [isBlur, setIsBlur] = useState({
    email: false,
    password: false,
  });

  function handleChangeInput(e: React.ChangeEvent<Element>, flag: string) {
    setInputValue({
      ...inputValue,
      [flag]: (e.target as HTMLInputElement).value,
    });

    setIsBlur({
      ...isBlur,
      [flag]: false,
    });

    if (flag === 'email') {
      setIsValid({
        ...isValid,
        [flag]: isEmail((e.target as HTMLInputElement).value),
      });
    }

    if (flag === 'password') {
      setIsValid({
        ...isValid,
        [flag]: isValidPassword((e.target as HTMLInputElement).value),
      });
    }
  }

  function handleBlurInput(flag: string) {
    setIsBlur({
      ...isBlur,
      [flag]: true,
    });
  }

  return (
    <StyledSignIn>
      <Form id="signInForm" method="post" action="/signin">
        <p className="p-signIn">로그인 하시겠어요?</p>
        <div className="formInputWrapper">
          <FormInput
            mode={'register'}
            type={'email'}
            name={'email'}
            placeholder="가입 이메일 주소"
            hiddenLabel={true}
            value={inputValue.email}
            onChange={(e) => {
              handleChangeInput(e, 'email');
            }}
            onBlur={() => handleBlurInput('email')}
          >
            이메일
          </FormInput>
          {inputValue.email && !isValid.email && isBlur.email && (
            <span className="span-error">
              올바른 이메일 형식을 입력해주세요.
            </span>
          )}
        </div>
        <div className="formInputWrapper">
          <FormInput
            mode={'register'}
            type={'password'}
            name={'password'}
            placeholder="영문, 숫자, 특수문자 조합 8~20자리"
            hiddenLabel={true}
            value={inputValue.password}
            onChange={(e) => {
              handleChangeInput(e, 'password');
            }}
            onBlur={() => handleBlurInput('password')}
          >
            비밀번호
          </FormInput>
          {inputValue.password && !isValid.password && isBlur.password && (
            <span className="span-error">
              올바른 비밀번호 형식을 입력해주세요.
            </span>
          )}
        </div>
        {isValid.email && isValid.password ? (
          <Button size={'100%'} mode={'normal'} type="submit" form="signInForm">
            로그인
          </Button>
        ) : (
          <Button size={'100%'} mode={'disabled'}>
            로그인
          </Button>
        )}
      </Form>
    </StyledSignIn>
  );
};

SignIn.displayName = 'SignIn';
