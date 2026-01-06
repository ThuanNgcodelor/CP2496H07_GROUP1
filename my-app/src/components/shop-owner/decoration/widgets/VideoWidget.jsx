import React, { useState } from 'react';
import { Form, Spinner, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { uploadVideo, getVideoUrl } from '../../../../api/image';

const VideoWidget = ({ data, onChange }) => {
    const { t } = useTranslation();
    const [uploading, setUploading] = useState(false);

    // Constants for validation
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    const ALLOWED_TYPES = ['video/mp4', 'video/webm'];

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        if (!ALLOWED_TYPES.includes(file.type)) {
            toast.error(t('shopOwner.decoration.widgets.videoFormatError') || 'Only MP4 and WebM are supported');
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            toast.error(t('shopOwner.decoration.widgets.videoSizeError') || 'File size must be less than 50MB');
            return;
        }

        setUploading(true);
        try {
            const videoId = await uploadVideo(file);
            if (videoId) {
                // Force sourceType to 'upload' or just rely on videoId existence
                onChange({ ...data, videoId: videoId, sourceType: 'upload', url: '' }); // Clear URL if any
                toast.success(t('shopOwner.decoration.savedSuccess'));
            }
        } catch (error) {
            console.error(error);
            toast.error(t('shopOwner.decoration.saveFailed'));
        } finally {
            setUploading(false);
            e.target.value = ''; // Reset input
        }
    };

    return (
        <div className="p-2">
            <h5 className="mb-3">{t('shopOwner.decoration.widgets.videoTitle')}</h5>

            <Form.Group className="mb-3">
                <Form.Label>{t('shopOwner.decoration.widgets.uploadVideo') || 'Upload Local Video'}</Form.Label>
                <div className="d-flex gap-2 align-items-center">
                    <div className="position-relative">
                        <input
                            type="file"
                            id="video-upload"
                            className="d-none"
                            accept="video/mp4,video/webm"
                            onChange={handleFileUpload}
                        />
                        <label
                            htmlFor="video-upload"
                            className={`btn btn-outline-primary ${uploading ? 'disabled' : ''}`}
                        >
                            {uploading ? (
                                <><Spinner as="span" animation="border" size="sm" /> Uploading...</>
                            ) : (
                                <><i className="bi bi-folder2-open me-2"></i> Select Video</>
                            )}
                        </label>
                    </div>
                    <div className="text-muted small">
                        Max 50MB. MP4/WebM.
                    </div>
                </div>
            </Form.Group>

            {/* Preview Section */}
            <div className="preview-section mt-3">
                <label className="fw-bold mb-2 text-secondary">Preview</label>

                {/* Uploaded Video Preview */}
                {data.videoId ? (
                    <div className="ratio ratio-16x9 bg-dark rounded overflow-hidden">
                        <video
                            controls
                            src={getVideoUrl(data.videoId)}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                ) : (
                    <div className="ratio ratio-16x9 bg-light rounded d-flex align-items-center justify-content-center text-muted border border-dashed">
                        <div className="text-center">
                            <i className="bi bi-play-btn fs-1 opacity-50"></i>
                            <p className="mb-0 small">No video selected</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoWidget;
