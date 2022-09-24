import './resources.css';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import debug from 'aquifer-debug';
import * as resourceService from '../../services/resourcesService';

const _logger = debug.extend('ResourceWithDetails');

function ResourceWithDetails() {
    const load = useLocation();

    const [resourceCardData, setResourceCardData] = useState({
        id: 0,
        name: '',
        headline: '',
        description: '',
        logo: '',
        resourceCategory: {
            id: 0,
            name: '',
        },
        organization: {
            id: 0,
            organizationType: {
                id: 0,
                name: null,
            },
            name: '',
            headline: '',
            description: '',
            logo: '',
            location: {
                id: 0,
                locationType: {
                    id: 0,
                    name: '',
                },
                lineOne: '',
                lineTwo: '',
                city: '',
                zip: '',
                state: {
                    code: '',
                    id: 0,
                    name: '',
                },
                latitude: 0,
                longitude: 0,
                dateCreated: '',
                dateModified: '',
                createdBy: 0,
                modifiedBy: 0,
            },
            phone: '',
            siteUrl: '',
            dateCreated: '',
            dateModified: '',
            createdBy: 0,
        },
        contactName: '',
        contactEmail: '',
        phone: '',
        siteUrl: '',
        dateCreated: '',
        dateModified: '',
        createdBy: 0,
        modifiedBy: 0,
    });
    useEffect(() => {
        _logger('load', load);
        _logger('id', load.state.payload.id);
        const loadId = load.state.payload.id;
        resourceService
            .getResourceByIdDetails(loadId)
            .then(GetResourceByIdDetailsSuccess)
            .catch(GetResourceByIdDetailsError);
    }, []);

    const GetResourceByIdDetailsSuccess = (response) => {
        _logger('response:', response);
        setResourceCardData((prevState) => {
            let rData = { ...prevState };
            rData = response.item;
            return rData;
        });
        _logger('state', resourceCardData);
    };
    const GetResourceByIdDetailsError = (response) => {
        _logger(response);
    };

    return (
        <div className="card">
            <div className="card-body">
                <div className="row">
                    <img src={resourceCardData.logo} alt="Resource Logo" className="details-img"></img>
                    <h3> {resourceCardData.name} </h3>
                    <h4> Resource ID: {resourceCardData.id} </h4>
                    <h5>{resourceCardData.headline} </h5>
                    <h5>Description: {resourceCardData.description}</h5>
                    <h5>Resource Type: {resourceCardData.resourceCategory.name} </h5>
                    <a href={resourceCardData.siteUrl} target={resourceCardData.siteUrl}>
                        <div className="text-decoration-line">
                            <strong>
                                <u>{resourceCardData.name} Website </u>
                            </strong>
                        </div>
                    </a>
                    <h5> Contact Name: {resourceCardData.contactName} </h5>
                    <h5> Phone Number: {resourceCardData.phone} </h5>
                    <h5> Email: {resourceCardData.contactEmail} </h5>
                    <h4 className="card-text card-title">Organization Name: {resourceCardData.organization.name}</h4>
                    <h5 className="card-text">Organization Description: {resourceCardData.organization.description}</h5>
                    <h5 className="card-text">Organization Address:</h5>
                    <h5 className="card-text">{resourceCardData.organization.location.lineOne} </h5>
                    <h5 className="card-text">{resourceCardData.organization.location.lineTwo} </h5>
                    <h5 className="card-text">
                        {resourceCardData.organization.location.city}{' '}
                        {resourceCardData.organization.location.state.name} {resourceCardData.organization.location.zip}
                    </h5>
                    <a href={resourceCardData.organization.siteUrl} target={resourceCardData.organization.siteUrl}>
                        <div className="text-decoration-line">
                            <strong>
                                <u>{resourceCardData.organization.name} Website</u>
                            </strong>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ResourceWithDetails;
