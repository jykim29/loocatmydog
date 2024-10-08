import A11yHidden from '@/components/A11yHidden/A11yHidden';
import { useId } from 'react';
import styled from 'styled-components';

const StyledFilterCheck = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  ${(props) => props.theme.fontStyles.textRegularSm};
  background-color: ${(props) => props.theme.colors.gray100};
  border: 1px solid ${(props) => props.theme.colors.gray300};
  border-radius: 10px;
  cursor: pointer;
  user-select: none;

  input:checked + & {
    ${(props) => props.theme.fontStyles.textSemiboldSm};
    background-color: ${(props) => props.theme.colors.primary};
    border-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.textBlack};
  }
`;

interface FilterButtonProps {
  name: string;
  isCheck: boolean;
  setIsCheck: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: string | React.JSX.Element;
}

const FilterButton = ({
  name,
  isCheck,
  setIsCheck,
  children,
}: FilterButtonProps) => {
  const id = useId();
  return (
    <>
      <A11yHidden
        id={id}
        as="input"
        name={name}
        type="checkbox"
        checked={isCheck}
        onChange={setIsCheck}
      />
      <StyledFilterCheck htmlFor={id}>{children}</StyledFilterCheck>
    </>
  );
};

export default FilterButton;
