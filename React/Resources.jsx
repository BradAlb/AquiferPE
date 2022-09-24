import './resources.css';
import { Row, Col } from 'react-bootstrap';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import debug from 'aquifer-debug';
import * as resourceService from '../../services/resourcesService';
import Resource from '../resources/Resource';
import Pagination from 'rc-pagination';
import locale from 'rc-pagination/lib/locale/en_US';
import 'rc-pagination/assets/index.css';
import swal from '@sweetalert/with-react';
import PropTypes from 'prop-types';
import ResourceCategories from './ResourceCategories';

const _logger = debug.extend('Resources');

function Resources(props) {
    const navigate = useNavigate();
    const [resourceData, setResourceData] = useState({
        arrayOfResources: [],
        resourceComponents: [],
        page: {
            pageIndex: 0,
            pageSize: 4,
            totalCount: 0,
            totalPages: 0,
        },
    });

    const [role, setRole] = useState({
        isOrgAdmin: false,
        isAdmin: false,
    });

    false && _logger(resourceData.arrayOfResources);

    useEffect(() => {
        _logger('Firing useEffect for get resources');
        resourceService
            .getAllResources(resourceData.page.pageIndex, resourceData.page.pageSize)
            .then(onGetAllResourcesSuccess)
            .catch(onGetAllResourcesError);
        _logger('current role', props.currentUser.roles);
        if (props.currentUser.roles.includes('Org Admin')) {
            setRole((prevState) => {
                const newRole = { ...prevState };
                newRole.isOrgAdmin = true;
                return newRole;
            });
        } else if (props.currentUser.roles.includes('Admin')) {
            setRole((prevState) => {
                const newRole = { ...prevState };
                newRole.isAdmin = true;
                return newRole;
            });
        }
    }, []);

    const onDeleteResource = useCallback((id) => {
        resourceService.deleteResource(id).then(onDeleteSuccess).catch(onDeleteError);
    }, []);

    const onDeleteSuccess = (response) => {
        _logger('getDeleteSuccessHandler -->', response);

        setResourceData((prevState) => {
            const rData = { ...prevState };

            _logger('rData ->', rData);

            const idxOf = rData.arrayOfResources.findIndex((resource) => {
                return parseInt(resource.id) === response;
            });

            const updatedArrayOfResources = [...prevState.arrayOfResources];

            if (idxOf >= 0) {
                updatedArrayOfResources.splice(idxOf, 1);
                rData.resourceComponents = updatedArrayOfResources.map(mapResource);
            }

            return rData;
        });

        swal({
            position: 'top-end',
            icon: 'success',
            title: 'Your resource has been deleted!',
            showConfirmButton: false,
            timer: 5000,
        });
    };

    const onDeleteError = (err) => {
        _logger('Delete error', err);
        swal({
            buttons: {
                cancel: 'Ok',
            },
            title: 'Error occured with deletion.',
            icon: 'error',
        });
    };

    const mapResource = (resource) => {
        return (
            <Resource
                resourceProp={resource}
                onResourceClicked={onDeleteResource}
                user={props.currentUser}
                key={resource.id}
            />
        );
    };

    const onGetAllResourcesSuccess = (response) => {
        _logger('getAll response', response);
        let resourceArray = response.item.pagedItems;
        _logger('resource Item', resourceArray);

        setResourceData((prevState) => {
            let pd = { ...prevState };
            pd.arrayOfResources = resourceArray;
            pd.resourceComponents = resourceArray.map(mapResource);
            pd.page.pageIndex = response.item.pageIndex;
            pd.page.pageSize = response.item.pageSize;
            pd.page.totalCount = response.item.totalCount;
            pd.page.totalPages = response.item.totalPages;
            _logger('RESPONSE HERE', response);
            return pd;
        });
    };

    const onGetAllResourcesError = (err) => {
        _logger('Get resources error', err);
    };

    const onChange = (currentPage) => {
        _logger('CURRENT PAGE', currentPage);

        resourceService
            .getAllResources(currentPage - 1, resourceData.page.pageSize)
            .then(onGetAllResourcesSuccess)
            .catch(onGetAllResourcesError);
    };

    const navigateToAdd = () => {
        navigate(`/resources/new`);
    };

    return (
        <React.Fragment>
            <Row className="title-res-cnmpro">
                <Col className="text-center">
                    <h1>Resources</h1>
                </Col>
            </Row>
            {role.isOrgAdmin ? (
                <Row className="align-item-center mb-2">
                    <Col className="col-2">
                        <ResourceCategories currentUser={role}></ResourceCategories>
                    </Col>
                    <Col>
                        <button
                            type="button"
                            id="newResource"
                            className="btn btn-primary btn-success"
                            onClick={navigateToAdd}>
                            Create a Resource
                        </button>
                    </Col>
                </Row>
            ) : (
                <div></div>
            )}
            {role.isAdmin ? (
                <Row>
                    <ResourceCategories currentUser={role}></ResourceCategories>
                </Row>
            ) : (
                <div></div>
            )}
            <Row>
                <div className="col-8 justify-content-end ml-3">
                    <Pagination
                        onChange={onChange}
                        current={resourceData.page.pageIndex + 1}
                        total={resourceData.page.totalCount}
                        locale={locale}
                        pageSize={resourceData.page.pageSize}
                        prevIcon="<<<"
                        nextIcon=">>>"
                        className="mb-2"
                    />
                </div>
            </Row>
            <Row>{resourceData.resourceComponents}</Row>
            <Row>
                <div className="col-8 justify-content-end ml-3">
                    <Pagination
                        onChange={onChange}
                        current={resourceData.page.pageIndex + 1}
                        total={resourceData.page.totalCount}
                        locale={locale}
                        pageSize={resourceData.page.pageSize}
                        prevIcon="<<<"
                        nextIcon=">>>"
                        className="mb-2"
                    />
                </div>
            </Row>
        </React.Fragment>
    );
}
Resources.propTypes = {
    currentUser: PropTypes.shape({
        email: PropTypes.string,
        id: PropTypes.number,
        isLoggedIn: PropTypes.bool,
        roles: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
};
export default Resources;
