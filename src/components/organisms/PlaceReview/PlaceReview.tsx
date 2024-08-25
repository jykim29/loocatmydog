import PlaceSection from '@/components/molecules/PlaceSection/PlaceSection';
import getPbImageURL from '@/utils/getPbImageURL';
import { styled } from 'styled-components';

//type 지정
interface ReviewPhotoProps {
  src: string;
  alt: string;
}

const StyledPlaceReview = styled.div`
  padding: 0 20px;
  & > p {
    ${(props) => props.theme.fontStyles.textSemiboldBase}
    color: ${(props) => props.theme.colors.textBlack};
    margin-bottom: 15px;
  }
  margin-bottom: 30px;
`;
const StyledPhotoList = styled.div`
  display: flex;
  gap: 3%;
  & > p {
    ${(props) => props.theme.fontStyles.textRegularMd}
    color: ${(props) => props.theme.colors.textDarkGray};
  }
`;
const StyledReviewPhoto = styled.figure`
  inline-size: 22%;
  aspect-ratio: 1/1;
  border-radius: 4px;
  overflow: hidden;
  & img {
    height: 100%;
    object-fit: cover;
  }
`;

const ReviewPhoto = ({ src, alt }: ReviewPhotoProps) => {
  return (
    <StyledReviewPhoto>
      <img src={src} alt={alt} />
    </StyledReviewPhoto>
  );
};

const PlaceReview = ({ data }: { data: any }) => {
  const reviewList = data?.expand['boards(placeId)'];
  const images = reviewList
    ? reviewList.map(
        ({
          collectionId,
          id,
          photo,
        }: {
          collectionId: string;
          id: string;
          photo: string;
        }) => getPbImageURL(collectionId, id, photo[0])
      )
    : [];
  return (
    <StyledPlaceReview>
      <StyledPhotoList>
        {images.map((image: string, index: number) => (
          <ReviewPhoto key={index} src={image} alt="리뷰" />
        ))}
        {images.length === 0 && <p>등록된 후기가 없습니다.</p>}
      </StyledPhotoList>
    </StyledPlaceReview>
  );
};

export default PlaceReview;
