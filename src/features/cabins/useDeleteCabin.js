import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteCabin as deleteCabinApi } from "../../services/apiCabins";

export function useDeleteCabin() {
  const queryClient = useQueryClient();

  // ! the way we do mutation in react query is like this:
  const { isLoading: isDeleting, mutate: deleteCabin } = useMutation({
    // this is the function that react-query calls
    // mutationFn: (id) => deleteCabin(id),
    //? as the input is the same:
    mutationFn: deleteCabinApi,
    // ! to make the app revalidate when it was successfully deleted
    onSuccess: () => {
      toast.success("cabin successfully deleted");

      queryClient.invalidateQueries({
        // ! this is why the keys should be unique
        queryKey: ["cabins"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteCabin };
}
