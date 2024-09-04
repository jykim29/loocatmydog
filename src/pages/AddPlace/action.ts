import pb from '@/api/pocketbase';
import { useAuthStore } from '@/store/useAuthStore';
import useDateRangeStore from '@/store/useDateRange';
import { redirect } from 'react-router-dom';

export async function action({ request }: { request: any }) {
  const formData = await request.formData();
  const newFormData = new FormData();
  const userId = useAuthStore.getState().user?.id;
  const [minDate, maxDate] = useDateRangeStore.getState().dateRange;
  const tagList = formData.get('tag').replace(/\s/g, '').match(/[^#]+/g);

  newFormData.append('title', formData.get('title'));
  newFormData.append('tag', JSON.stringify(tagList));
  newFormData.append('address', formData.get('address'));
  newFormData.append('userId', userId);
  newFormData.append('minDate', (minDate as Date).toISOString());
  newFormData.append('maxDate', (maxDate as Date).toISOString());
  for (const item of formData.getAll('service'))
    newFormData.append('service', item);
  newFormData.append('priceSmall', formData.get('priceSmall'));
  newFormData.append('priceMiddle', formData.get('priceMiddle'));
  newFormData.append('priceLarge', formData.get('priceLarge'));
  for (const item of formData.getAll('addImg'))
    newFormData.append('photo', item);
  newFormData.append('introduce', formData.get('introduce'));

  try {
    const response = await pb.from('places').create(newFormData as any);
    console.log(response);
    alert('플레이스 등록이 완료됐습니다.');
    return redirect('/main');
  } catch (error) {
    console.log('Error while writing : ', error);
  }
}
