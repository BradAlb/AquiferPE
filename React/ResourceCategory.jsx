import React from 'react';
import PropTypes from 'prop-types';
import logger from 'aquifer-debug';
import './resources.css';

const _logger = logger.extend('ResourceCategory');

function ResourceCategory(props) {
    _logger('Resource Category props', props.resourceCategoryProp);

    const resourceCategory = props.resourceCategoryProp;

    return (
        <div className="row">
            <div className="card-title"> {resourceCategory.name} </div>
            <input type="hidden" value={resourceCategory.id}></input>
        </div>
    );
}

ResourceCategory.propTypes = {
    resourceCategoryProp: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
    }),
};

export default ResourceCategory;
