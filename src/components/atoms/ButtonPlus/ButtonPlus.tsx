import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface ButtonPlusProps {
  path?: string;
}

const StyledButtonPlusWrapper = styled.div`
  position: absolute;
  right: 80px;
`;

const StyledButtonPlus = styled(Link).attrs({
  'aria-label': '글작성 페이지 이동',
})`
  display: block;
  background: url('/images/buttonPlus.svg') no-repeat 0 0 / contain;
  width: 45px;
  height: 45px;
  border: none;
  position: fixed;
  bottom: 100px;
  transition: all 0.2s;
  &:hover {
    filter: brightness(1.1);
  }
`;

const ButtonPlus = ({ path = '/' }: ButtonPlusProps) => {
  return (
    <StyledButtonPlusWrapper>
      <StyledButtonPlus to={path} />
    </StyledButtonPlusWrapper>
  );
};

export default ButtonPlus;
