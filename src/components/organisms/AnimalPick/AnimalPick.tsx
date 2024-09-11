import Button from '@/components/atoms/Button/Button';
import ProfileImage from '@/components/atoms/ProfileImage/ProfileImage';
import InputTextArea from '@/components/molecules/InputTextArea/InputTextArea';
import ProfileCardRadioButton from '@/components/molecules/ProfileCard/ProfileCardRadioButton';
import { useAuthStore } from '@/store/useAuthStore';
import getPbImageURL from '@/utils/getPbImageURL';
import { useRef } from 'react';
import styled from 'styled-components';

interface AnimalPickProps {
  reservationForm: {
    require: string;
    etc: string;
    petId: string;
  };
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  resetInput: () => void;
}

type modeProps = 'normal' | 'gray' | 'disabled' | 'kakao' | 'google' | 'chat';

//styled 컴포넌트
const StyledAnimalPickModal = styled.dialog`
  inline-size: 95%;
  max-inline-size: 420px;
  border-radius: 5px;
  border: none;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.1);

  & .modalInner {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
  & .modalHeader {
    display: flex;
    justify-content: space-between;
  }
  & .closeButton {
    background: url('/images/cross.svg') no-repeat 0 0 / contain;
    inline-size: 20px;
    block-size: 20px;
  }
  & .modalTitle {
    ${(props) => props.theme.fontStyles.textSemiboldBase}
    color: ${(props) => props.theme.colors.textBlack}
  }
  & .profileWrapper {
    display: flex;
    gap: 10px;
  }
`;
const StyledAnimalPickSection = styled.div`
  & > p {
    ${(props) => props.theme.fontStyles.textSemiboldBase}
    color: ${(props) => props.theme.colors.textBlack};
    margin-bottom: 15px;
  }
  margin-bottom: 30px;
`;
const StyledPetListContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  & .info {
    ${(props) => props.theme.fontStyles.textRegularBase}
    color: ${(props) => props.theme.colors.textDarkGray};
  }
`;

const StyledPlusButton = styled.button`
  background: url('/images/plusButton.svg');
  display: inline-block;
  inline-size: 24px;
  block-size: 24px;
`;

const AnimalProfile = ({
  src,
  ...restProps
}: {
  src: string;
  [key: string]: any;
}) => {
  return <ProfileImage as="button" type="button" src={src} {...restProps} />;
};

const AnimalPick = ({
  reservationForm,
  onChange: handleChangeInput,
  resetInput,
}: AnimalPickProps) => {
  const { user: userData } = useAuthStore();
  const myPetList = userData?.expand.petId;
  const modalRef = useRef<HTMLDialogElement>(null);
  const isValid =
    reservationForm.require.length > 0 && reservationForm.petId.length > 0;

  const handleClickCloseModal = () => {
    if (modalRef.current) {
      resetInput();
      modalRef.current.close();
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    console.log(reservationForm);
    modalRef.current?.close();
  };
  return (
    <>
      <StyledAnimalPickModal as="dialog" ref={modalRef}>
        <form className="modalInner" onSubmit={handleSubmit}>
          <div className="modalHeader">
            <button
              className="closeButton"
              type="button"
              onClick={handleClickCloseModal}
            ></button>
            <span className="modalTitle">반려동물</span>
          </div>
          <div className="profileWrapper">
            {myPetList.map((petData: any) => {
              return (
                <ProfileCardRadioButton
                  key={petData.id}
                  name="petId"
                  src={getPbImageURL(
                    petData.collectionId,
                    petData.id,
                    petData.image
                  )}
                  value={petData.id}
                  onChange={handleChangeInput}
                >
                  <span className="name">{petData.petName}</span>
                  <span className="description">
                    {`${petData.breed}, ${petData.weight}kg`}
                  </span>
                </ProfileCardRadioButton>
              );
            })}
          </div>
          <InputTextArea
            requestCheck={'필수'}
            name="require"
            isRequired={true}
            inputValue={reservationForm.require}
            onChange={handleChangeInput}
          />
          <InputTextArea
            requestCheck={'선택'}
            request="기타 요청 사항"
            name="etc"
            inputValue={reservationForm.etc}
            onChange={handleChangeInput}
          />
          <Button
            type="submit"
            size="100%"
            isRounded={false}
            mode={isValid ? 'normal' : 'disabled'}
          >
            저장 하기
          </Button>
        </form>
      </StyledAnimalPickModal>
      <StyledAnimalPickSection>
        <StyledPetListContainer>
          {userData?.petId?.length === 0 ? (
            <>
              <p className="info">반려동물을 추가해주세요</p>
              <StyledPlusButton />
            </>
          ) : (
            myPetList?.map((item: any) => (
              <AnimalProfile
                src={getPbImageURL(item.collectionId, item.id, item.image)}
                key={item.id}
                onClick={() => {
                  modalRef.current?.showModal();
                }}
              />
            ))
          )}
        </StyledPetListContainer>
      </StyledAnimalPickSection>
    </>
  );
};

export default AnimalPick;
