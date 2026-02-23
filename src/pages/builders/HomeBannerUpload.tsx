import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadHomeBanners, clearMessages } from '../../store/slices/buildersSlice';
import type { AppDispatch, RootState } from '../../store/store';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { imageUploadToS3 } from '../../services/api';

const HomeBannerUpload = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, successMessage } = useSelector((state: RootState) => state.builders);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [fileNames, setFileNames] = useState<string[]>([]);

    const { user } = useSelector((state: RootState) => state.auth);
    const companyID = user?.companyID;
    const userID = user?.userId;

    async function handleFileChange(e: ChangeEvent<HTMLInputElement>, docFor: string = 'HomeBanner') {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newFiles = Array.from(files);

        // Update local previews for UI immediately
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews].slice(0, 5));
        setSelectedFiles(prev => [...prev, ...newFiles].slice(0, 5));

        // If you want immediate upload to S3 for each file:
        for (const file of newFiles) {
            if (file.type.startsWith('image/') || file.type === 'application/pdf') {
                try {
                    const directoryPath = `uploadsA/Company/Company-${companyID}/Builder/${docFor}`;
                    const uploadResponse = await imageUploadToS3(file, directoryPath, user);

                    if (uploadResponse && uploadResponse !== 'Image Upload Failed') {
                        const fileName = uploadResponse.fileName;
                        setFileNames(prev => [...prev, fileName]);

                        console.log('File uploaded successfully:', uploadResponse);
                    } else {
                        console.error('File upload failed');
                    }
                } catch (error) {
                    console.error('Error uploading file:', error);
                }
            }
        }
    }

    // const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files) {
    //         const files = Array.from(e.target.files);

    //         imageUploadToS3()

    //         // if (files.length + selectedFiles.length > 5) {
    //         //     alert('You can only upload a maximum of 5 images.');
    //         //     return;
    //         // }

    //         const newFiles = [...selectedFiles, ...files].slice(0, 5);
    //         setSelectedFiles(newFiles);

    //         // Generate previews
    //         const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    //         setPreviews(newPreviews);
    //     }
    // };

    const removeFile = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);

        // Also remove from fileNames
        const newFileNames = fileNames.filter((_, i) => i !== index);
        setFileNames(newFileNames);

        // Update previews
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        dispatch(clearMessages());

        if (fileNames.length === 0) {
            return;
        }

        if (!companyID || !userID) {
            alert('User or Company information missing. Please log in again.');
            return;
        }

        const imgdata = {
            fileNames,
            companyID,
            userID,
        };

        dispatch(uploadHomeBanners(imgdata));

        // Note: Success handling (clearing files) could be moved to a useEffect based on successMessage
        // or handled here if it's not and async action that might fail.
        // For now, keeping it as is but it might be better in .then() or useEffect.
        setSelectedFiles([]);
        setPreviews([]);
        setFileNames([]);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>Upload Home Banners</h2>

            {successMessage && (
                <div style={{ padding: '1rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '4px', marginBottom: '1.5rem', border: '1px solid #bbf7d0' }}>
                    {successMessage}
                </div>
            )}

            {error && (
                <div style={{ padding: '1rem', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: '4px', marginBottom: '1.5rem', border: '1px solid #fecaca' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '500', color: '#374151' }}>
                        Select Images (Max 5)
                    </label>
                    <div style={{ border: '2px dashed #d1d5db', borderRadius: '6px', padding: '2rem', textAlign: 'center', cursor: 'pointer', backgroundColor: '#f9fafb' }} onClick={() => document.getElementById('file-upload')?.click()}>
                        <Upload size={32} color="#9ca3af" style={{ marginBottom: '1rem' }} />
                        <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Click to upload or drag and drop</p>
                        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>PNG, JPG up to 5MB</p>
                        <input
                            id="file-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'HomeBanner')}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                {previews.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                        {previews.map((preview, index) => (
                            <div key={index} style={{ position: 'relative', aspectRatio: '1', borderRadius: '4px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                                <img src={preview} alt={`Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                    style={{ position: 'absolute', top: '0.25rem', right: '0.25rem', padding: '0.25rem', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <X size={14} color="#ef4444" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        type="submit"
                        disabled={loading || selectedFiles.length === 0}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: loading || selectedFiles.length === 0 ? '#9ca3af' : '#4f46e5',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading || selectedFiles.length === 0 ? 'not-allowed' : 'pointer',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        {loading ? 'Uploading...' : 'Upload Banners'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default HomeBannerUpload;
