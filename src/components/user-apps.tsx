import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserApps } from "@/actions/user-apps";
import { AppCard } from "./app-card";

export function UserApps() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["userApps"],
    queryFn: getUserApps,
    initialData: [],
  });

  const onAppDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ["userApps"] });
  };

  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="flex flex-wrap justify-center gap-4 px-4 sm:px-8 max-w-7xl">
        {data.map((app) => (
          <div key={app.id} className="w-full max-w-2xl">
            <AppCard 
              id={app.id}
              name={app.name}
              createdAt={app.createdAt}
              onDelete={onAppDeleted}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
