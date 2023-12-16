import { cn } from "@/lib/utils";

// import { useParams } from "react-router-dom";

const MainNav = (props: React.HTMLAttributes<HTMLElement>) => {
  const { className } = props;

  //   const params = useParams();
  const pathname = window.location.pathname;

  const routes = [
    {
      href: `/`,
      label: "Overview",
      active: pathname === `/`,
    },
    {
      href: `/employees`,
      label: "Employees",
      active: pathname === `/employees`,
    },
    // {
    //   href: `/employees/search`,
    //   label: "Search",
    //   active: pathname === `/employees/search`,
    // },
  ];
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => (
        <a
          href={route.href}
          key={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </a>
      ))}
    </nav>
  );
};

export default MainNav;
