import debug from 'aquifer-debug';
import React, { useState, useEffect, useCallback } from 'react';
import { Button, Collapse, Col } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as resourceCategoriesService from '../../services/resourceCategoriesService';
import lookUpService from '../../services/lookUpService';
import ResourceCategory from './ResourceCategory';
import swal from '@sweetalert/with-react';
import PropTypes from 'prop-types';
import './resources.css';

const _logger = debug.extend('ResourceCategories');

function ResourceCategories(props) {
    const [resourceCategoryData, setResourceCategoryData] = useState({
        arrayOfResourceCategories: [],
        cardComponents: [],
        resourceCategory: '',
        isCreated: false,
    });
    const [open, setOpen] = useState(false);
    const roles = props.currentUser;

    useEffect(() => {
        _logger('Firing useEffect for get resources');
        lookUpService.LookUp(['ResourceCategories']).then(onSuccessLookUp).catch(onLookUpError);
    }, []);

    const onSuccessLookUp = (response) => {
        _logger('onSuccessLookup response', response);
        let resourceCategoryArray = response.item.resourceCategories;
        _logger('onSuccessLookup Array', resourceCategoryArray);

        setResourceCategoryData((prevState) => {
            let pd = { ...prevState };
            pd.arrayOfResourceCategories = resourceCategoryArray;
            pd.cardComponents = resourceCategoryArray.map(mapResourceCategory);
            pd.isCreated = false;
            _logger('RESPONSE HERE', response);
            return pd;
        });
    };

    const onLookUpError = (err) => {
        _logger('Get resourceCategories error', err);
        swal({
            buttons: {
                cancel: 'Ok',
            },
            title: 'Error occured with rendering.',
            icon: 'error',
        });
    };

    const mapResourceCategory = (resourceCategory) => {
        _logger('premapped resourceCategories', resourceCategory);
        return (
            <div key={resourceCategory.id}>
                <ResourceCategory resourceCategoryProp={resourceCategory} />
            </div>
        );
    };

    const handleSubmit = useCallback((values) => {
        _logger('name to be created', values.resourceCategory);
        let data = { category: values.resourceCategory };
        resourceCategoriesService.createResourceCategory(data).then(onCreateSuccess).catch(onCreateError);
    }, []);

    const onCreateSuccess = (response) => {
        _logger('onCreateSuccessHandler -->', response);
        setResourceCategoryData((prevState) => {
            return { ...prevState, isCreated: true };
        });

        swal({
            position: 'top-end',
            icon: 'success',
            title: 'Your resource has been added!',
            showConfirmButton: false,
            timer: 5000,
        });
    };

    const onCreateError = (err) => {
        _logger('Create error', err);
        swal({
            buttons: {
                cancel: 'Ok',
            },
            title: 'Error occured with creation.',
            icon: 'error',
        });
    };

    return (
        <>
            <Col>
                <Button
                    className="btn btn-primary mb-2"
                    onClick={() => setOpen(!open)}
                    aria-controls="collapse-component"
                    aria-expanded={open}>
                    Resource Categories
                </Button>
            </Col>

            <Collapse in={open}>
                <div id="collapse-component">
                    <div>{resourceCategoryData.cardComponents}</div>
                    {roles.isAdmin ? (
                        <div className="col-6">
                            <Formik
                                enableReinitialize={true}
                                initialValues={resourceCategoryData}
                                onSubmit={handleSubmit}>
                                {() => (
                                    <Form>
                                        <div className="input-group mb-3">
                                            <Field
                                                placeholder="Resource Category Name"
                                                type="text"
                                                name="resourceCategory"
                                                className="form-control input-res-cnmpro"
                                            />
                                            <ErrorMessage
                                                name="name"
                                                component="div"
                                                className="has-error-res-cnmpro"
                                            />
                                            <Button className="btn-primary" type="submit">
                                                Add
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
            </Collapse>
        </>
    );
}
ResourceCategories.propTypes = {
    currentUser: PropTypes.shape({
        isOrgAdmin: PropTypes.bool,
        isAdmin: PropTypes.bool,
    }).isRequired,
};
export default ResourceCategories;
