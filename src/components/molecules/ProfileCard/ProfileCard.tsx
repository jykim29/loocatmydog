import { ReactNode } from 'react';
import styled from 'styled-components';
import ProfileImage from '../../atoms/ProfileImage/ProfileImage';

// type 지정
interface ButtonCheckProps {
  children: string | ReactNode;
  src?: string;
  [key: string]: any;
}

// styled component 작성
const StyledProfileCardContainer = styled.div`
  position: relative;
  inline-size: 100%;
  block-size: 60px;
  ${(props) => props.theme.fontStyles.textRegularSm}
  ${(props) => props.theme.colors.textGray}
`;

const StyledProfileCard = styled.div`
  inline-size: 100%;
  block-size: 100%;
  border-radius: 4px;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  padding: 6px 10px;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  border: 1px solid ${(props) => props.theme.colors.orange};
  background: ${(props) => props.theme.colors.orangeBg};

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

const ProfileCard = ({ children, src, ...restProps }: ButtonCheckProps) => {
  return (
    <StyledProfileCardContainer>
      <StyledProfileCard>
        <div className="info">{children}</div>
        {src ? (
          <ProfileImage src={src} />
        ) : (
          <ProfileImage src={'/images/plusIcon.svg'} />
        )}
      </StyledProfileCard>
    </StyledProfileCardContainer>
  );
};

export default ProfileCard;
