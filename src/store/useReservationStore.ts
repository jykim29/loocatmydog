import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

//type 지정
interface InitialState {
  reservation: {
    reservationData: { [key: string]: any } | null;
  };
}

interface Action {
  setReservation: (data: Object) => void;
  resetReservation: () => void;
}
const initialState: InitialState = {
  reservation: {
    reservationData: null,
  },
};

const useReservationStore = create<InitialState & Action>()(
  devtools((set) => ({
    ...initialState,
    setReservation: (data) =>
      set((state) => ({ ...state, reservation: { reservationData: data } })),
    resetReservation: () =>
      set((state) => ({
        ...state,
        reservation: {
          reservationData: null,
        },
      })),
  }))
);

export default useReservationStore;
