import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
    Typography,
    IconButton,
    Stack,
} from '@mui/material';
import {
    Close as CloseIcon,
    CloudUploadOutlined as UploadIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// ============================================
// Styled Components
// ============================================

const StyledDialog = styled(Dialog)({
    '& .MuiDialog-paper': {
        borderRadius: '20px',
        margin: '16px',
        width: 'calc(100% - 32px)',
        maxWidth: '480px',
        overflow: 'hidden',
    },
});

// Branded modal header — matches app primary color
const ModalHeader = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 20px 16px',
    backgroundColor: 'var(--primary-color)',
});

// Shared input style — light fill + subtle border, primary focus
const fieldSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        fontSize: '0.9rem',
        '& fieldset': { border: '1px solid #00000014' },
        '&:hover fieldset': { border: '1px solid #00000014' },
        '&.Mui-focused fieldset': { border: '1px solid #00000014' },
        '&.Mui-disabled': { backgroundColor: 'rgba(0,0,0,0.04)' },
    },
    '& .MuiInputLabel-root': {
        color: '#94a3b8',
        fontSize: '0.88rem',
        '&.Mui-focused': { color: 'var(--primary-color)' },
    },
    '& .MuiSelect-icon': { color: '#94a3b8' },
};

const UploadBox = styled(Box)({
    border: '1.5px dashed #c5cdd8',
    borderRadius: '12px',
    padding: '20px 16px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#f5f7fa',
    transition: 'all 0.2s',
    '&:hover': {
        borderColor: 'var(--primary-color)',
        backgroundColor: 'rgba(var(--primary-rgb), 0.04)',
    },
});

const FileInput = styled('input')({ display: 'none' });

// ============================================
// Data
// ============================================

const requestTypes = [
    { value: 'annual',    label: 'Annual Leave' },
    { value: 'sick',      label: 'Sick Leave' },
    { value: 'emergency', label: 'Emergency Leave' },
    { value: 'dayoff',    label: 'Day Off' },
];

// ============================================
// Component
// ============================================

const VacationRequestModal = ({ open, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        type: 'annual',
        fromDate: '',
        toDate: '',
        fromTime: '',
        toTime: '',
        comment: '',
        file: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files?.[0]) {
            setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
        }
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
    };

    const isPartialDay = formData.type === 'emergency';

    return (
        // IONIC MIGRATION: replace with <IonModal>
        <StyledDialog open={open} onClose={onClose} fullWidth>

            {/* Branded header */}
            <ModalHeader>
                <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>
                        Request Time Off
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)', mt: 0.25 }}>
                        Fill in the details below
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small" sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)' } }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </ModalHeader>

            <DialogContent sx={{ px: 2.5, pt: 2.5, pb: 1 }}>
                <Stack spacing={2}>

                    {/* Request Type */}
                    <TextField
                        select
                        label="Request Type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        sx={fieldSx}
                    >
                        {requestTypes.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Date row */}
                    <Stack direction="row" spacing={1.5}>
                        <TextField
                            type="date"
                            label="From Date"
                            name="fromDate"
                            value={formData.fromDate}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            sx={fieldSx}
                        />
                        <TextField
                            type="date"
                            label="To Date"
                            name="toDate"
                            value={formData.toDate}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            sx={fieldSx}
                        />
                    </Stack>

                    {/* Time row — Emergency only */}
                    {isPartialDay && (
                        <Stack direction="row" spacing={1.5}>
                            <TextField
                                type="time"
                                label="From Time"
                                name="fromTime"
                                value={formData.fromTime}
                                onChange={handleChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                sx={fieldSx}
                            />
                            <TextField
                                type="time"
                                label="To Time"
                                name="toTime"
                                value={formData.toTime}
                                onChange={handleChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                sx={fieldSx}
                            />
                        </Stack>
                    )}

                    {/* Attachment */}
                    <Box>
                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', mb: 0.75 }}>
                            Attachment (Optional)
                        </Typography>
                        <label htmlFor="vacation-file-upload">
                            <FileInput accept="image/*,.pdf" id="vacation-file-upload" type="file" onChange={handleFileChange} />
                            <UploadBox>
                                <UploadIcon sx={{ fontSize: 28, color: '#94a3b8', mb: 0.5 }} />
                                <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>
                                    {formData.file ? formData.file.name : 'Tap to attach a file or image'}
                                </Typography>
                            </UploadBox>
                        </label>
                    </Box>

                    {/* Comment */}
                    <TextField
                        label="Comments"
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        multiline
                        rows={3}
                        fullWidth
                        placeholder="Add any additional details..."
                        sx={fieldSx}
                    />
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 2.5, pb: 2.5, pt: 1.5, gap: 1 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        borderRadius: '12px', px: 3, fontWeight: 600,
                        borderColor: '#e2e8f0', color: '#64748b',
                        '&:hover': { backgroundColor: '#f5f7fa', borderColor: '#c5cdd8' },
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                        flex: 1, borderRadius: '12px', py: 1.25, fontWeight: 700,
                        backgroundColor: 'var(--primary-color)',
                        boxShadow: 'none',
                        '&:hover': { backgroundColor: 'var(--primary-hover)', boxShadow: 'none' },
                    }}
                >
                    Submit Request
                </Button>
            </DialogActions>
        </StyledDialog>
    );
};

export default VacationRequestModal;
