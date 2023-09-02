import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabins";

export function useCabins() {
  // using react query
  const { isLoading, data: cabins } = useQuery({
    // ! we have to set 2 things
    // the key can be a simple array or maybe a complex one - uniquely identifies what we want to query here
    queryKey: ["cabins"],
    // the function actually responsible for querying - fetching data from api -
    //! it needs to return a promise
    queryFn: getCabins,
  });

  return { isLoading, cabins };
}
