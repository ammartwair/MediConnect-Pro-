import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

const AvatarEditLabel = () => {
  return (
    <label htmlFor="imageUpload">
      <FontAwesomeIcon icon={faCamera} color="#757575" />
    </label>
  );
};

export default AvatarEditLabel;
