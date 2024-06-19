import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCircleNotch, faRefresh } from '@fortawesome/free-solid-svg-icons';

export default function LoadingButton() {
    return (
        <><FontAwesomeIcon icon={faCircleNotch} spin /> Loading </>
    )
}
