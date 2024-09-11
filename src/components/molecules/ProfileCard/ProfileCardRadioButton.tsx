import { useId } from 'react';
import styled from 'styled-components';
import ProfileImage from '../../atoms/ProfileImage/ProfileImage';

// type 지정
interface ButtonCheckProps {
  src?: string;
  children: React.ReactNode;
  [key: string]: any;
}

// styled component 작성
const StyledButtonCheckContainer = styled.div`
  display: inline-block;
  position: relative;
  max-inline-size: 190px;
  min-block-size: 80px;
  inline-size: 50%;
  ${(props) => props.theme.fontStyles.textRegularSm}
  ${(props) => props.theme.colors.textGray}
`;
const StyledButtonCheckLabel = styled.label`
  inline-size: 100%;
  block-size: 100%;
  border-radius: 4px;
  position: absolute;
  cursor: pointer;
  left: 0;
  top: 0;
  display: flex;
  padding: 6px 10px;
  justify-content: center;
  align-items: center;
  text-align: left;
  border: 1px solid ${(props) => props.theme.colors.lineColorGray};
  background: ${(props) => props.theme.colors.white};

  & .info {
    display: flex;
    flex-flow: column;
    flex: 1;
  }

  & .name {
    ${(props) => props.theme.fontStyles.textSemiboldMd};
    color: ${(props) => props.theme.colors.textBlack};
    text-align: center;
    margin-bottom: 5px;
  }
  & .description {
    display: block;
    text-align: center;
  }
`;

const StyledButtonRadio = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;

  &:checked + label {
    border: 1px solid ${(props) => props.theme.colors.orange};
    background: rgba(255, 182, 43, 0.1);
  }
`;

const ProfileCardRadioButton = ({
  src,
  children,
  ...restProps
}: ButtonCheckProps) => {
  const id = useId();
  return (
    <StyledButtonCheckContainer>
      <StyledButtonRadio id={id} type="radio" {...restProps} />
      <StyledButtonCheckLabel htmlFor={id}>
        <div className="info">{children}</div>
        {src ? (
          <ProfileImage src={src} />
        ) : (
          <ProfileImage src={'/images/plusIcon.svg'} />
        )}
      </StyledButtonCheckLabel>
    </StyledButtonCheckContainer>
  );
};

export default ProfileCardRadioButton;
