import React, { useState } from 'react';
import './Profile.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AvatarEditLabel from '../AvatarEditLabel/AvatarEditLabel.jsx';
import { faPencil } from '@fortawesome/free-solid-svg-icons'

const ImageUpload = ({ onImageUpload, image, edit }) => {
    const [imagePreviewUrl, setImagePreviewUrl] = useState(image);

    const handleImageChange = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            setImagePreviewUrl(reader.result);
            onImageUpload(file);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container imageUpload prof">
            <div className="pavatar-upload">
                {edit &&
                    <div className="avatar-edit">
                        <input
                            type='file'
                            id="imageUpload"
                            accept=".png, .jpg, .jpeg"
                            onChange={handleImageChange}
                        />
                        <label htmlFor="imageUpload" className='d-flex justify-content-center align-items-center'>
                            <FontAwesomeIcon icon={faPencil} />
                        </label>
                    </div>
                }
                <div className="avatar-preview">
                    <div id="imagePreview" style={{ backgroundImage: `url(${imagePreviewUrl || 'https://www.webiconio.com/_upload/255/image_255.svg'})` }}>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;
