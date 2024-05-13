'use client';

import { FaCog, FaEdit, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { FaChartLine, FaIdBadge, FaKey } from 'react-icons/fa6';

export const sideBarAdminList = [
  {
    id: 1,
    icon: <FaChartLine />,
    title: 'Dashboard',
    path: '/admin/dashboard',
    list: null,
    isDropdown: false,
  },
  {
    id: 2,
    icon: <FaUser />,
    title: 'Moderators',
    path: '/admin/dashboard/users',
    list: null,
    isDropdown: false,
  },
  {
    id: 3,
    icon: <FaCog />,
    title: 'Settings',
    path: '/admin/dashboard/settings',
    isDropdown: true,
    list: [
      {
        id: 1,
        title: 'Change Password',
        path: '/admin/dashboard/change-password',
        icon: <FaKey />,
      },
      {
        id: 2,
        title: 'Edit Details',
        path: '/admin/dashboard/edit-details',
        icon: <FaIdBadge />,
      },
    ],
  },
  {
    id: 4,
    icon: <FaSignOutAlt />,
    title: 'Sign Out',
    path: '/admin/sign-out',
    list: null,
    color: 'text-red-500',
    isDropdown: false,
  },
];

export const sideBarList = [
  {
    id: 1,
    icon: <FaChartLine />,
    title: 'Dashboard',
    path: '/admin/dashboard',
    list: null,
    isDropdown: false,
  },
  {
    id: 2,
    icon: <FaCog />,
    title: 'Settings',
    path: '/admin/dashboard/settings',
    isDropdown: true,
    list: [
      {
        id: 1,
        title: 'Change Password',
        path: '/admin/dashboard/change-password',
        icon: <FaKey />,
      },
      {
        id: 2,
        title: 'Edit Details',
        path: '/admin/dashboard/edit-details',
        icon: <FaIdBadge />,
      },
    ],
  },
  {
    id: 3,
    icon: <FaSignOutAlt />,
    title: 'Sign Out',
    path: '/admin/sign-out',
    list: null,
    color: 'text-red-500',
    isDropdown: false,
  },
];
