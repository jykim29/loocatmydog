import Button from '@/components/atoms/Button/Button';
import ButtonCheck from '@/components/atoms/ButtonCheck/ButtonCheck';
import Calendar from '@/components/atoms/Calendar/Calendar';
import InputWrapper from '@/components/atoms/InputWrapper/InputWrapper';
import AnimalRateInput from '@/components/molecules/AnimalRateInput/AnimalRateInput';
import ImageSwiperContainer from '@/components/molecules/ImageSwiper/ImageSwiperContainer';
import { service } from '@/data/service';
import useDateRangeStore from '@/store/useDateRange';
import { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import Modal from 'react-modal';
import { Form } from 'react-router-dom';
import styled from 'styled-components';

const StyledAddSection = styled.div`
  padding: 20px 20px 0;
  margin-bottom: 20px;

  & .sectionTitle {
    ${(props) => props.theme.fontStyles.textSemiboldBase}
    color: ${(props) => props.theme.colors.textBlack};
    margin-bottom: 15px;
  }
  & .buttonWrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }
  & .innerWrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    & > span {
      ${(props) => props.theme.fontStyles.textRegularMd}
      color: ${(props) => props.theme.colors.textBlack};
      display: inline-block;
      inline-size: 40px;
    }
    & input {
      ${(props) => props.theme.fontStyles.textMediumBase}
      color: ${(props) => props.theme.colors.textBlack};
    }

    & input:placeholder-shown {
      ${(props) => props.theme.fontStyles.textRegularMd}
      color: ${(props) => props.theme.colors.textDarkGray};
    }
  }
  & .info {
    ${(props) => props.theme.fontStyles.textRegularSm}
    color: ${(props) => props.theme.colors.textDarkGray};
    display: block;
    text-align: end;
  }
  & .introduce {
    inline-size: 100%;
    border: none;
    outline: none;
    resize: none;
    border: 1px solid ${(props) => props.theme.colors.lineColorGray};
    border-radius: 4px;
    padding: 5px;
    min-block-size: 150px;
    ${(props) => props.theme.fontStyles.textRegularMd}
  }
`;

// Modal 스타일
const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: '1',
  },
  content: {
    left: '0',
    margin: 'auto',
    width: '500px',
    height: '600px',
    padding: '0',
    overflow: 'hidden',
  },
};

const StyledMultiplePhotoInputContainer = styled.div`
  position: relative;
  & label {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    gap: 5px;
    inline-size: 100%;
    block-size: 150px;

    background-color: ${(props) => props.theme.colors.gray100};
    &:focus {
      border: 2px solid #000;
    }
  }
  & input[type='file'] {
    inline-size: 100%;
    block-size: 150px;
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    color: transparent;

    &::file-selector-button {
      border: none;
      display: none;
      appearance: none;
    }
  }
`;

export const AddPlace = () => {
  const { dateRange } = useDateRangeStore();
  const [showImages, setShowImages] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [roadAddress, setRoadAddress] = useState('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const serviceList = Object.entries(service);

  // 이미지 상대경로 저장
  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageLists = e.target.files;
    const imageUrlLists: string[] = [...showImages];
    if (imageUrlLists.length > 10) {
      return alert('이미지 등록은 10개까지만 가능합니다');
    }

    if (imageLists) {
      for (let i = 0; i < imageLists.length; i++) {
        const currentImageUrl = URL.createObjectURL(imageLists[i]);
        imageUrlLists.push(currentImageUrl);
      }
    }

    setShowImages(imageUrlLists);
  };

  const searchAddress = () => {
    setIsOpen(true);
  };
  const completeHandler = (data: any) => {
    setRoadAddress(data.roadAddress);
    setIsEditingAddress(!isEditingAddress);
    setIsOpen(false);
  };

  return (
    <Form
      id="placeForm"
      method="post"
      // action="/places/post"
      encType="multipart/form-data"
    >
      <ImageSwiperContainer
        type="picture"
        imageUrls={showImages}
        onChange={handleAddImages}
        input={true}
      />
      <StyledAddSection>
        <p className="sectionTitle">제목</p>
        <InputWrapper
          name="title"
          unit=""
          placeholder="플레이스의 이름을 입력해주세요"
        />
      </StyledAddSection>
      <StyledAddSection>
        <p className="sectionTitle">태그</p>
        <div className="innerWrapper">
          <span>태그명</span>
          <InputWrapper name="tag" unit="" placeholder="#로 구분가능" />
        </div>
      </StyledAddSection>
      <StyledAddSection>
        <p className="sectionTitle">주소</p>
        <div className="innerWrapper" style={{ alignItems: 'end' }}>
          <InputWrapper
            name="address"
            unit=""
            placeholder="예) 연희동 132, 도선대로 33"
            value={roadAddress}
          />
          <Button
            type="button"
            size="30%"
            mode="normal"
            onClick={searchAddress}
          >
            검색
          </Button>
        </div>
      </StyledAddSection>
      <StyledAddSection>
        <p className="sectionTitle">가능한 날짜 선택</p>
        <Calendar />
        <span className="info">최대 한달 이내의 날짜를 선택할 수 있어요</span>
      </StyledAddSection>
      <StyledAddSection>
        <p className="sectionTitle">이용금액</p>
        <AnimalRateInput size="소형" name="priceSmall" />
        <AnimalRateInput size="중형" name="priceMiddle" />
        <AnimalRateInput size="대형" name="priceLarge" />
      </StyledAddSection>
      <StyledAddSection>
        <div className="buttonWrapper">
          {serviceList.map(([key, value]) => {
            return (
              <ButtonCheck
                key={value.name}
                name="service"
                title={value.name}
                value={key}
              >
                {value.text}
              </ButtonCheck>
            );
          })}
        </div>
      </StyledAddSection>
      <StyledAddSection>
        <p className="sectionTitle">자기소개</p>
        <textarea name="introduce" className="introduce"></textarea>
      </StyledAddSection>
      <StyledAddSection style={{ paddingBottom: '30px' }}>
        <Button type="submit" mode="normal" size="100%">
          등록하기
        </Button>
      </StyledAddSection>
      <Modal
        isOpen={isOpen}
        ariaHideApp={false}
        style={customStyles}
        onRequestClose={() => setIsOpen(false)}
      >
        <DaumPostcode onComplete={completeHandler} />
      </Modal>
    </Form>
  );
};
