import './resources.css';
import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import debug from 'aquifer-debug';
import { useNavigate, useLocation } from 'react-router-dom';
import * as resourceService from '../../services/resourcesService';
import resourceSchema from '../../schema/resources/resourceSchema';
import * as organizationsService from '../../services/organizationsService';
import lookUpService from '../../services/lookUpService';
import Swal from '@sweetalert/with-react';

const _logger = debug.extend('ResourceForm');

function ResourceForm() {
    const navigate = useNavigate();
    const { state } = useLocation();

    const [resourceFormData, setResourceFormData] = useState({
        id: 0,
        name: '',
        headline: '',
        description: '',
        logo: '',
        resourceCategoryId: 0,
        orgId: 0,
        contactName: '',
        contactEmail: '',
        phone: '',
        siteUrl: '',
    });

    const [orgData, setOrgData] = useState([]);

    const [lookUpData, setLookUpData] = useState([]);

    useEffect(() => {
        if (state?.type === 'RESOURCE_FORM_EDIT') {
            setResourceFormData((prevState) => {
                const newResourceObj = { ...prevState };
                newResourceObj.id = state.payload.id;
                newResourceObj.name = state.payload.name;
                newResourceObj.headline = state.payload.headline;
                newResourceObj.description = state.payload.description;
                newResourceObj.logo = state.payload.logo;
                newResourceObj.resourceCategoryId = state.payload.resourceCategoryId;
                newResourceObj.orgId = state.payload.orgId;
                newResourceObj.contactName = state.payload.contactName;
                newResourceObj.contactEmail = state.payload.contactEmail;
                newResourceObj.phone = state.payload.phone;
                newResourceObj.siteUrl = state.payload.siteUrl;
                return newResourceObj;
            });
        }
    }, [state]);

    useEffect(() => {
        organizationsService.GetAllOrganizations(0, 200).then(onGetAllOrgSuccess).catch(onAxiosError);
        lookUpService.LookUp(['ResourceCategories']).then(onSuccessLookUp).catch(onAxiosError);
    }, []);

    const onGetAllOrgSuccess = (response) => {
        _logger('onGetAllOrgSuccess ->', response);
        const mapOrgs = response.data.item.pagedItems.map((org) => {
            _logger('org ->', org);
            return (
                <option key={org.id} value={org.id}>
                    {org.name}
                </option>
            );
        });
        setOrgData(mapOrgs);
    };

    const onSuccessLookUp = (response) => {
        _logger('lookUp ->', response);
        const mapResCats = response.item.resourceCategories.map((resCat) => {
            _logger('resCat ->', resCat);
            return (
                <option key={resCat.id} value={resCat.id}>
                    {resCat.name}
                </option>
            );
        });
        setLookUpData(mapResCats);
    };

    const onAxiosError = (response) => {
        _logger('onAxiosError ->', response);
    };

    const handleSubmit = (values) => {
        if (values.id === 0) {
            resourceService.createResource(values).then(onPostNewResourceSuccess).catch(onPostNewResourceError);
        } else {
            resourceService
                .updateResource(values.id, values)
                .then(onUpdateResourceSuccess)
                .catch(onUpdateResourceError);
        }
    };

    const onPostNewResourceSuccess = (response) => {
        _logger('onPostNewResourceSuccess ->', response);
        _logger('New resource id', response.item);

        let responseId = response.item;

        Swal({
            position: 'top-end',
            icon: 'success',
            title: 'Your Resource has successfully been created!',
            showConfirmButton: false,
            timer: 5000,
        });

        _logger('responseId ->', responseId);

        navigate(`/resources`);
    };

    const onPostNewResourceError = (response) => {
        _logger('onPostNewResourceError ->', response);
    };

    const onUpdateResourceSuccess = (response) => {
        _logger('onUpdateResourceSuccess ->', response);

        Swal({
            position: 'top-end',
            icon: 'success',
            title: 'Your Resource has been successfully been updated!',
            showConfirmButton: false,
            timer: 5000,
        });

        navigate(`/resources`);
    };

    const onUpdateResourceError = (response) => {
        _logger('onUpdateResourceError ->', response);
    };

    return (
        <div className="container">
            <Row>
                <Col>
                    <Card className="mx-auto col-8 mt-4">
                        <Formik
                            enableReinitialize={true}
                            initialValues={resourceFormData}
                            validationSchema={resourceSchema}
                            onSubmit={handleSubmit}>
                            {({ values }) => (
                                <Form>
                                    <Col className="col mx-4">
                                        <h3 className="mt-2 text-center">Resources Information</h3>
                                        <Field type="hidden" name="id" className="form-control" />
                                        <div className="form-group mt-2">
                                            <label htmlFor="name-of-resource">Name of Resource</label>
                                            {values.resourceFormData}
                                            <Field
                                                placeholder="Resource Name"
                                                type="text"
                                                name="name"
                                                className="form-control"
                                            />
                                            <ErrorMessage
                                                name="name"
                                                component="div"
                                                className="has-error-res-cnmpro"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="Headline" className="mt-2">
                                                Headline
                                            </label>
                                            <Field
                                                placeholder="Mission Statement, Slogan, etc."
                                                type="text"
                                                component="textarea"
                                                name="headline"
                                                className="form-control"
                                            />
                                            <ErrorMessage
                                                name="headline"
                                                component="div"
                                                className="has-error-res-cnmpro"
                                            />
                                            <div className="form-group">
                                                <label htmlFor="Description" className="mt-2">
                                                    Description
                                                </label>
                                                <Field
                                                    placeholder="Brief description of resource"
                                                    type="text"
                                                    component="textarea"
                                                    name="description"
                                                    className="form-control"
                                                />
                                                <ErrorMessage
                                                    name="description"
                                                    component="div"
                                                    className="has-error-res-cnmpro"
                                                />
                                                <div className="side-by-side-res-cnmpro">
                                                    <div className="form-group short-left-label-res-cnmpro">
                                                        <label htmlFor="site-url" className="mt-2">
                                                            Resource Website
                                                        </label>
                                                        <Field
                                                            placeholder="www.example.com"
                                                            type="text"
                                                            name="siteUrl"
                                                            className="form-control"
                                                        />
                                                        <ErrorMessage
                                                            name="siteUrl"
                                                            component="div"
                                                            className="has-error-res-cnmpro"
                                                        />
                                                    </div>
                                                    <div className="form-group short-right-label-res-cnmpro">
                                                        <label htmlFor="Logo" className="mt-2">
                                                            Logo URL
                                                        </label>
                                                        <Field
                                                            placeholder="www.example.com"
                                                            type="text"
                                                            name="logo"
                                                            className="form-control"
                                                        />
                                                        <ErrorMessage
                                                            name="logo"
                                                            component="div"
                                                            className="has-error-res-cnmpro"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="number" className="mt-2">
                                                        Phone Number
                                                    </label>
                                                    <Field
                                                        placeholder="(000)000-0000"
                                                        type="text"
                                                        name="phone"
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage
                                                        name="phone"
                                                        component="div"
                                                        className="has-error-res-cnmpro"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="resourceCategoryId" className="mt-2">
                                                        Resource Type
                                                    </label>
                                                    <Field
                                                        as="select"
                                                        name="resourceCategoryId"
                                                        className="form-control">
                                                        <option>Please Select Resource Category</option>
                                                        {lookUpData}
                                                    </Field>
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="orgId" className="mt-2">
                                                        Organization
                                                    </label>
                                                    <Field as="select" name="orgId" className="form-control">
                                                        <option>Please Select Organization</option>
                                                        {orgData}
                                                    </Field>
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="cname" className="mt-2">
                                                        Contact Name
                                                    </label>
                                                    <Field
                                                        placeholder="Name of contact"
                                                        type="text"
                                                        name="contactName"
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage
                                                        name="contactName"
                                                        component="div"
                                                        className="has-error-res-cnmpro"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="email" className="mt-2">
                                                        Contact Email
                                                    </label>
                                                    <Field
                                                        placeholder="Name of contact"
                                                        type="text"
                                                        name="contactEmail"
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage
                                                        name="contactEmail"
                                                        component="div"
                                                        className="has-error-res-cnmpro"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary mt-2 mb-2">
                                            Submit
                                        </button>
                                    </Col>
                                </Form>
                            )}
                        </Formik>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default ResourceForm;
