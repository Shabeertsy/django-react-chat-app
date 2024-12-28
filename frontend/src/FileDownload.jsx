import React, { useEffect, useState } from 'react';
import './Peer.css'
import axios from 'axios';
import baseUrl from './Constant';

const FileDownloadComponent = ({ url, file_id }) => {
    const [fileExtension, setFileExtension] = useState();
    const [dUrl, setDUrl] = useState('');
    const fileUrl = url;

    useEffect(() => {
        const fileExtension = fileUrl.split('.').pop();
        setFileExtension(fileExtension);
    }, []);

    const onclickImage = () => {
        const img = document.createElement('img');
        img.src = fileUrl;
        img.style.maxWidth = '90%';
        img.style.height = '100%';
        img.style.position = 'fixed';
        img.style.top = '50%';
        img.style.left = '50%';
        img.style.transform = 'translate(-50%, -50%)';
        img.style.zIndex = '1000';
        img.style.cursor = 'pointer';

        const closeImage = (event) => {
            if (event.target === img) {
                document.body.removeChild(img);
                window.removeEventListener('click', closeImage);
            }
        };

        document.body.appendChild(img);
        window.addEventListener('click', closeImage);
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = fileUrl;

        const fileExtension = fileUrl.split('.').pop().toLowerCase();

        link.download = `downloaded-file.${fileExtension}`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileUrl.split('.').pop().toLowerCase());

    return (
        <div>
            {isImage ? (
                <img className='send-file' onClick={onclickImage} src={fileUrl} alt="Image" style={{ maxWidth: '100%' }} />
            ) : (
                <button className='file-download' onClick={handleDownload}>
                    <img className='file-up-img' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr42XHVb9LBPflpNhIazPhIoVDPvN5NgV_gA&usqp=CAU" alt="" />
                    <p className='file-d-name'> file.{fileExtension} </p>
                </button>
            )}
        </div>
    );
};

export default FileDownloadComponent;
