import { Fragment } from 'react';
import styled from 'styled-components';

const StyledTabBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  border-bottom: 1px solid ${(props) => props.theme.colors.lineColorGray};

  gap: 30px;

  & input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
`;

interface TabBoxLabelProps {
  $isActive: boolean;
}

const StyledTabLabel = styled.label<TabBoxLabelProps>`
  padding-inline: 30px;
  padding-block: 15px;
  color: ${(props) =>
    props.$isActive
      ? `${props.theme.colors.textBlack}`
      : `${props.theme.colors.textGray}`};
  border-bottom: ${(props) =>
    props.$isActive
      ? `2px solid ${props.theme.colors.orange}`
      : `2px solid transparent`};
  font-weight: ${(props) =>
    props.$isActive
      ? props.theme.fontWeight.semiBold
      : props.theme.fontWeight.regular};
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.colors.textBlack};
    border-bottom: 2px solid ${(props) => props.theme.colors.orange};
  }
`;

interface TabBoxProps {
  menuList: string[];
  currentTab: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
}

const Tab = ({ menuList, currentTab, onChange, ...restProps }: TabBoxProps) => {
  return (
    <StyledTabBox {...restProps}>
      {menuList.map((menu, index) => (
        <Fragment key={index}>
          <StyledTabLabel
            $isActive={currentTab === menu}
            htmlFor={`menu-${index}`}
          >
            {menu}
          </StyledTabLabel>
          <input
            type="radio"
            name="tab"
            id={`menu-${index}`}
            value={menu}
            onChange={onChange}
          />
        </Fragment>
      ))}
    </StyledTabBox>
  );
};

export default Tab;
