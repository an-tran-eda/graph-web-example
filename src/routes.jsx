import { lazy } from 'react';

const DashboardPage = lazy(() => import('./admin/dashboard'));
const ForgotPasswordPage = lazy(() => import('./admin/forgot-password'));
const LoginPage = lazy(() => import('./admin/login'));
const AddUserPage = lazy(() => import('./admin/manage-users/add'));
const EditUserPage = lazy(() => import('./admin/manage-users/edit'));
const ListUserPage = lazy(() => import('./admin/manage-users/list'));
const ViewUserPage = lazy(() => import('./admin/manage-users/view'));
const ProfilePage = lazy(() => import('./admin/profile'));
const ServiceCategory = lazy(() => import('./admin/service-category/list'));
const ViewServiceCategory = lazy(() => import('./admin/service-category/view'));
const EditServiceCategory = lazy(() => import('./admin/service-category/edit'));

const routes = [
  {
    path: '/admin/dashboard',
    name: 'dashboard',
    component: DashboardPage,
  },
  {
    path: '/admin/forgot-password',
    name: 'forgot-password',
    component: ForgotPasswordPage,
  },
  {
    path: '/admin/login',
    name: 'login',
    component: LoginPage,
  },
  {
    path: '/admin/profile',
    name: 'profile',
    component: ProfilePage,
  },
  {
    path: '/admin/users/add',
    name: 'add-user',
    component: AddUserPage,
  },
  {
    path: '/admin/users/edit/:id',
    name: 'profile',
    component: EditUserPage,
  },
  {
    path: '/admin/users/view/:id',
    name: 'profile',
    component: ViewUserPage,
  },
  {
    path: '/admin/users',
    name: 'user-list',
    component: ListUserPage,
  },
  {
    path: '/admin/service-categories',
    name: 'category-list',
    component: ServiceCategory,
  },
  {
    path: '/admin/service-categories/view/:id',
    name: 'view-category',
    component: ViewServiceCategory,
  },
  {
    path: '/admin/service-categories/edit/:id',
    name: 'edit-category',
    component: EditServiceCategory,
  },
];

export default routes;
