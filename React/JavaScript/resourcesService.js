import axios from 'axios';
import { API_HOST_PREFIX, onGlobalError, onGlobalSuccess } from './serviceHelpers';

const resourcesApi = `${API_HOST_PREFIX}/api/resources`;

const getResourceById = (resourceId) => {
    const config = {
        method: 'GET',
        url: `${resourcesApi}/${resourceId}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getAllResources = (pageIndex, pageSize) => {
    const config = {
        method: 'GET',
        url: `${resourcesApi}/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getResourceByIdDetails = (resourceId) => {
    const config = {
        method: 'GET',
        url: `${resourcesApi}/details?resourceId=${resourceId}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const createResource = (payload) => {
    const config = {
        method: 'POST',
        url: resourcesApi,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const updateResource = (resourceId, payload) => {
    const config = {
        method: 'PUT',
        url: `${resourcesApi}/${resourceId}`,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const deleteResource = (resourceId) => {
    const config = {
        method: 'DELETE',
        url: `${resourcesApi}/${resourceId}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config)
        .then(onGlobalSuccess)
        .then(() => resourceId)
        .catch(onGlobalError);
};

export { getResourceById, getAllResources, deleteResource, getResourceByIdDetails, createResource, updateResource };
