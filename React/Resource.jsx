import './resources.css';
import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import logger from 'aquifer-debug';

const _logger = logger.extend('Resource');

function Resource(props) {
    _logger(props.resourceProp);

    const [isOrgAdmin, setIsOrgAdmin] = useState(false);

    const resource = props.resourceProp;

    const navigate = useNavigate();

    useEffect(() => {
        if (props.user.roles.includes('Org Admin')) {
            setIsOrgAdmin(true);
        }
    }, []);

    const onDeleteResource = (e) => {
        e.preventDefault();
        props.onResourceClicked(props.resourceProp.id);
    };

    const onEditResourceClick = (e) => {
        e.preventDefault();
        const stateForTransport = { type: 'RESOURCE_FORM_EDIT', payload: resource };

        navigate(`/resources/${resource.id}/edit`, { state: stateForTransport });
    };

    const onResourceDetailsClick = () => {
        const stateForTransport = { type: 'RESOURCE_CARD_DETAILS', payload: resource };
        navigate(`/resources/${resource.id}/details`, { state: stateForTransport });
    };
    _logger(resource);

    return (
        <Col className="col-12 col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 text-center">
            <Card className="shadow-lg p-3 mb-5 bg-white rounded">
                <Card.Body>
                    <Row>
                        <img src={resource.logo} className="card-img-top center" alt="Resource Logo" />
                        <h3 className="card-title res-card-title-cnmpro"> {resource.name} </h3>
                        <h5 className="card-text">{resource.headline} </h5>
                        <h5> Phone Number: {resource.phone} </h5>
                        <div className="mb-2">
                            {isOrgAdmin ? (
                                <Row className="mt-2">
                                    <Col className="text-center">
                                        <button
                                            type="button"
                                            className="btn btn-primary col-12"
                                            onClick={onResourceDetailsClick}>
                                            Details
                                        </button>
                                    </Col>
                                    <Col className="text-center">
                                        <button
                                            type="button"
                                            className="btn btn-secondary col-12"
                                            onClick={onEditResourceClick}
                                            width="200 px">
                                            Edit
                                        </button>
                                    </Col>
                                    <Col className="text-center">
                                        <button
                                            type="button"
                                            className="btn btn-danger col-12"
                                            onClick={onDeleteResource}>
                                            Delete
                                        </button>
                                    </Col>
                                </Row>
                            ) : (
                                <Row>
                                    <button type="button" className="btn btn-primary" onClick={onResourceDetailsClick}>
                                        Details
                                    </button>
                                </Row>
                            )}
                        </div>
                    </Row>
                </Card.Body>
            </Card>
        </Col>
    );
}

Resource.propTypes = {
    resourceProp: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        headline: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        logo: PropTypes.string.isRequired,
        resourceCategoryId: PropTypes.number,
        orgId: PropTypes.number,
        contactName: PropTypes.string,
        contactEmail: PropTypes.string,
        phone: PropTypes.string.isRequired,
        siteUrl: PropTypes.string,
    }),
    onResourceClicked: PropTypes.func,
    user: PropTypes.shape({
        email: PropTypes.string,
        id: PropTypes.number,
        isLoggedIn: PropTypes.bool,
        roles: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
};

export default Resource;
