import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadSchoolImage, clearMessages } from '../../store/slices/schoolSlice';
import { imageUploadToS3, getS3PathFromResult } from '../../services/api';
import type { AppDispatch, RootState } from '../../store/store';
import { Upload } from 'lucide-react';

const S3_PATH = 'uploadsA/School/Library';

const UploadImage = () => {
    const [image, setImage] = useState<File | null>(null);
    const [caption, setCaption] = useState('');
    const [preview, setPreview] = useState<string | null>(null);
    const [uploadingS3, setUploadingS3] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, successMessage } = useSelector((state: RootState) => state.school);
    const { user } = useSelector((state: RootState) => state.auth);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async (e: FormEvent) => {
        e.preventDefault();
        if (!image) return;

        dispatch(clearMessages());
        setUploadingS3(true);
        let result: any;
        try {
            const loginData = user ? { companyID: user.companyID, databaseName: (user as any).databaseName } : null;
            const s3Result = await imageUploadToS3(image, S3_PATH, loginData);
            const imagePath = getS3PathFromResult(s3Result);
            if (imagePath) {
                result = await dispatch(uploadSchoolImage({ caption, imagePath }));
            } else {
                result = await dispatch(uploadSchoolImage({ file: image, caption }));
            }
            if (uploadSchoolImage.fulfilled.match(result)) {
                setImage(null);
                setCaption('');
                setPreview(null);
            }
        } finally {
            setUploadingS3(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>Upload Image</h3>

            {successMessage && (
                <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '4px', backgroundColor: '#dcfce7', color: '#166534' }}>
                    {successMessage}
                </div>
            )}

            {error && (
                <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '4px', backgroundColor: '#fee2e2', color: '#991b1b' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ border: '2px dashed #9ca3af', borderRadius: '8px', padding: '2rem', textAlign: 'center', cursor: 'pointer', position: 'relative' }}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                    />
                    {preview ? (
                        <img src={preview} alt="Preview" style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: '4px' }} />
                    ) : (
                        <div style={{ color: '#6b7280' }}>
                            <Upload size={48} style={{ margin: '0 auto 1rem' }} />
                            <p>Click or drag to upload an image</p>
                        </div>
                    )}
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Caption</label>
                    <input
                        type="text"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Optional caption..."
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || uploadingS3 || !image}
                    style={{
                        marginTop: '1rem',
                        padding: '0.75rem',
                        backgroundColor: (loading || uploadingS3 || !image) ? '#93c5fd' : '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: (loading || uploadingS3 || !image) ? 'not-allowed' : 'pointer',
                        fontWeight: '500'
                    }}
                >
                    {uploadingS3 ? 'Uploading to S3...' : loading ? 'Saving...' : 'Upload Image'}
                </button>
            </form>
        </div>
    );
};

export default UploadImage;
