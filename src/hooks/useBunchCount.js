import { remainingCounterBunchTicket } from "@/store/boxOfficeCounterSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useBunchCount = () => {
  const dispatch = useDispatch();

  const count = useSelector(
    (state) => state.box_office_counter.remaining_counter_bunch_ticket,
  );
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user?.counter) {
      dispatch(remainingCounterBunchTicket());

      const interval = setInterval(() => {
        dispatch(remainingCounterBunchTicket());
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [dispatch, user]);

  return count;
};