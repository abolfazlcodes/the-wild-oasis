import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import { toast } from "react-hot-toast";

export function useCheckout() {
  const queryClient = useQueryClient();

  const { mutate: checkout, isLoading: isCheckingOut } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        status: "checked-out",
      }),

    //   on success data is exactly the data returned from the mutation function
    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked out.`);
      // invalidate all the queries that are active which is easier
      queryClient.invalidateQueries({ active: true });
    },

    onError: () => toast.error("There was an error while checking out."),
  });

  return { checkout, isCheckingOut };
}
