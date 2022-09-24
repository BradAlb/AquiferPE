import { lazy } from 'react';

const Resources = lazy(() => import('../components/resources/Resources'));
const ResourceWithDetails = lazy(() => import('../components/resources/ResourceWithDetails'));
const ResourcesForm = lazy(() => import('../components/resources/ResourcesForm'));

const resources = [
    {
        path: '/resources',
        name: 'Resources',
        element: Resources,
        roles: ['Admin', 'Org Admin'],
        exact: true,
        isAnonymous: true,
    },
    {
        path: '/resources/:id/details',
        name: 'ResourceWithDetails',
        element: ResourceWithDetails,
        roles: ['Admin', 'Org Admin'],
        exact: true,
        isAnonymous: true,
    },
    {
        path: '/resources/:id/edit',
        name: 'ResourcesForm',
        element: ResourcesForm,
        roles: ['Org Admin'],
        exact: true,
        isAnonymous: true,
    },
    {
        path: '/resources/new',
        name: 'ResourcesForm',
        element: ResourcesForm,
        roles: ['Org Admin'],
        exact: true,
        isAnonymous: true,
    },
];

export default resources;
