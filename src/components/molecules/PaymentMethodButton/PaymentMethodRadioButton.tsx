import { useId } from 'react';
import styled from 'styled-components';
import { RequestPayParams } from 'iamport-typings/src';

interface StyledPaymentMethodButtonContainerProps {
  $pgImageSrc: string;
}

interface PgItem {
  id: number;
  label: RequestPayParams['pay_method'];
  name: RequestPayParams['pg'];
  imageSrc: string;
}

const StyledPaymentMethodButtonContainer = styled.div<StyledPaymentMethodButtonContainerProps>`
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
  & label {
    display: block;
    inline-size: 90px;
    block-size: 40px;
    border: 1px solid ${(props) => props.theme.colors.gray300};
    border-radius: 4px;
    background-image: ${(props) => `url('${props.$pgImageSrc}')`};
    background-repeat: no-repeat;
    background-position: center;
    filter: grayscale(1);
    cursor: pointer;
  }

  & input:checked + label,
  & label:hover {
    filter: none;
    border: 2px solid ${(props) => props.theme.colors.orange};
    background-color: ${(props) => props.theme.colors.orangeBg};
  }
`;

const PaymentMethodRadioButton = ({
  pgImageSrc,
  ...restProps
}: {
  pgImageSrc: PgItem['imageSrc'];
  [key: string]: any;
}) => {
  const id = useId();
  return (
    <StyledPaymentMethodButtonContainer $pgImageSrc={pgImageSrc}>
      <input type="radio" name="paymentMethod" id={id} {...restProps} />
      <label htmlFor={id}></label>
    </StyledPaymentMethodButtonContainer>
  );
};

export default PaymentMethodRadioButton;
