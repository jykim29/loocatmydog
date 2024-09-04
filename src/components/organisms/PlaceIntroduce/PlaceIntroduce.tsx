import DOMPurify from 'dompurify';
import { useState } from 'react';
import styled, { css } from 'styled-components';

interface StyledMorePButtonProps {
  $isShow: boolean;
}
interface StyledIntroduceProps {
  $isExpand: boolean;
}
const StyledMorePButton = styled.button<StyledMorePButtonProps>`
  display: ${(props) => (props.$isShow ? 'flex' : 'none')};
  border: 1px solid ${(props) => props.theme.colors.textDarkGray};
  border-radius: 10px;
  align-items: center;
  padding: 4px;
  margin: 0 auto;
  & span {
    ${(props) => props.theme.fontStyles.textRegularSm};
    color: ${(props) => props.theme.colors.textDarkGray};
    &:after {
      content: '';
      background: url('/images/direction_down.svg') no-repeat 0 0 / contain;
      inline-size: 10px;
      block-size: 5px;
      display: inline-block;
      margin-inline-start: 3px;
    }
  }
`;

const StyledIntroduce = styled.div<StyledIntroduceProps>`
  position: relative;
  ${(props) => props.theme.fontStyles.textRegularSm};
  color: ${(props) => props.theme.colors.textBlack};
  word-break: break-all;
  overflow: hidden;
  line-height: 1.5;
  max-height: ${(props) => (props.$isExpand ? 'auto' : '100px')};
  ${(props) =>
    !props.$isExpand &&
    css`
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        inline-size: 100%;
        block-size: 100%;
        background: linear-gradient(180deg, transparent 70%, #fff 100%);
      }
    `};
`;

const PlaceIntroduce = ({ introduce }: { introduce: string }) => {
  const [isExpand, setIsExpand] = useState<boolean>(false);
  const isMoreButtonShow = introduce.length > 50 && !isExpand;
  const handleClickToggleExpand = () => {
    setIsExpand(!isExpand);
  };

  return (
    <>
      <StyledIntroduce
        $isExpand={isExpand}
        id="introduce"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(introduce) }}
      ></StyledIntroduce>
      <StyledMorePButton
        type="button"
        $isShow={isMoreButtonShow}
        onClick={handleClickToggleExpand}
      >
        <span>더보기</span>
      </StyledMorePButton>
    </>
  );
};

export default PlaceIntroduce;
