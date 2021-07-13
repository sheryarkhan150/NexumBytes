import Index from "./views/TenantForm";
import TenantTable from "./views/TenantTable";
import FranchiseTable from "./views/FranchiseTable";
import NetworkServerTable from "./views/NetworkServerTable";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-indigo",
    layout: "/dashboard",
    accessTo: ['admin', 'tenant', 'franchise', 'dealer', 'guest']
  },
  {
    path: "/tenants",
    name: "Tenant",
    icon: "ni ni-building text-red",
    layout: "/dashboard",
    accessTo: ['admin']
  },
  {
    path: "/franchises",
    name: "Franchise",
    icon: "ni ni-shop text-green",
    layout: "/dashboard",
    accessTo: ['admin', 'tenant']
  },
  {
    path: "/dealers",
    name: "Dealer",
    icon: "ni ni-badge text-orange",
    layout: "/dashboard",
    accessTo: ['admin', 'tenant', 'franchise']
  },
  {
    path: "/customers",
    name: "Customer",
    icon: "ni ni-bullet-list-67 text-grey",
    layout: "/dashboard",
    accessTo: ['admin', 'tenant', 'franchise', 'dealer']
  },
  {
    path: "/network-servers",
    name: "NAS",
    icon: "ni ni-world-2 text-blue",
    layout: "/dashboard",
    accessTo: ['admin', 'tenant']
  },
  {
    path: "/packages",
    name: "Package",
    icon: "ni ni-box-2 text-yellow",
    layout: "/dashboard",
    accessTo: ['admin', 'tenant']
  },
  // {
  //   path: "/user-profile",
  //   name: "User Profile",
  //   icon: "ni ni-single-02 text-yellow",
  //   component: Profile,
  //   layout: "/dashboard",
  // },
];
export default routes;
