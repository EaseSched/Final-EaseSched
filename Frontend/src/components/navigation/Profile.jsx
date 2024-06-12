import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "@/Hooks/Authentication/useAuthStore";

export const Profile = () => {
  const user = useAuthStore((state) => state.user);
console.log("user", user)
  const user_role = user.roleId === 1 ? "Admin" : "Shift Manager";
  const navigation = useNavigate();

  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className=" p-6  hover:bg-transparent ">
              <div className="flex h-5/6 items-center justify-end">
                <div className="h-10 w-10 flex bg-[#E9F7FF] text-[#009BFF] justify-center items-center mr-2 rounded-full">
                  <p className="font-extrabold text-sm">
                    {user.name?.slice(" ")[0][0].toLocaleUpperCase()}
                    {user.name?.slice(" ")[1][0].toLocaleUpperCase()}
                  </p>
                </div>
                <div className="ml-1 text-xs  flex-col jsutify-start items-start hidden md:flex ">
                  <div className="flex  w-max   ">
                    <p className="mr-4 text-gray-500">{user.name}</p>
                  </div>
                  <p className="font-bold">{user_role}</p>
                </div>
              </div>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-white p-[5rem] w-full py-1 text-sm">
              <NavigationMenuLink className=" ">
                <button
                  className="py-3"
                  onClick={() => {
                    navigation("/shift_manager/profile");
                  }}
                >
                  Profile
                </button>
              </NavigationMenuLink>
              <NavigationMenuLink className=" ">
                <button
                  className="py-3"
                  onClick={() => {
                    navigation("/shift_manager/history");
                  }}
                >
                  History
                </button>
              </NavigationMenuLink>
              <NavigationMenuLink
                onClick={() => {
                  localStorage.clear();
                  navigation("../", { replace: true });
                }}
              >
                <button className="py-3">Logout</button>
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};
