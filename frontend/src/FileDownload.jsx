import React, { useEffect, useState } from 'react';
import './Peer.css'
import axios from 'axios';
import baseUrl from './Constant';


const FileDownloadComponent = ({ url,file_id }) => {
    const [fileExtension, setFileExtension] = useState()
    const [dUrl,setDUrl]=useState('')
    const fileUrl = url


    useEffect(() => {
        const fileExtension = fileUrl.split('.').pop()
        setFileExtension(fileExtension)
    }, [])


        const onclickImage = () => {
        axios.get(`${baseUrl}/download-file/${file_id}/`, { responseType: 'blob' })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `downloaded-file.${fileExtension}`); 
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
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
                <img className='send-file' src={fileUrl} alt="Image" style={{ maxWidth: '100%' }} />
            ) : (
                <button  className='file-download' onClick={onclickImage}><img className='file-up-img' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr42XHVb9LBPflpNhIazPhIoVDPvN5NgV_gA&usqp=CAU" alt="" /> <p className='file-d-name'> file.{fileExtension} </p> </button>
            )}
        </div>
    );
};

export default FileDownloadComponent;
