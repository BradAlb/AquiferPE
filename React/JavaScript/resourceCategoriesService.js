import axios from 'axios';
import { API_HOST_PREFIX, onGlobalError, onGlobalSuccess } from './serviceHelpers';

const resourceCategoriesApi = `${API_HOST_PREFIX}/api/resourcecategories`;

const createResourceCategory = (payload) => {
    const config = {
        method: 'POST',
        url: resourceCategoriesApi,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export { createResourceCategory };
