import React, { useState } from 'react';
import { css } from '@emotion/react';
import { ClipLoader } from 'react-spinners';

function Loader() {
    const [loading, setLoading] = useState(true);

    const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                zIndex: 9999,
            }}
            className='flex justify-center items-center h-full'>
            <ClipLoader color={'#36D7B7'} loading={loading} css={override} size={100} />
        </div>
    );
}

export default Loader;
