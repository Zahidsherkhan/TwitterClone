import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useFollow = () => {
  const queryClient = useQueryClient();

  const { mutate: followMutation, isPending } = useMutation({
    mutationFn: async ({ userId }) => {
      try {
        const res = await fetch(`/api/users/follow/${userId}`, {
          method: "POST",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    onSuccess: (_data, variables) => {
      const { username, followerId } = variables;

      queryClient.setQueryData(["user", username], (oldData) => {
        if (!oldData) return oldData;

        const isAlreadyFollowing = oldData.followers.includes(followerId);

        return {
          ...oldData,
          followers: isAlreadyFollowing
            ? oldData.followers.filter((id) => id !== followerId)
            : [...oldData.followers, followerId],
        };
      });

      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
      ]);
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { followMutation, isPending };
};

export default useFollow;
