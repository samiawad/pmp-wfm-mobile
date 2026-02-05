import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
    Typography,
    IconButton,
    Stack,
    InputAdornment,
} from '@mui/material';
import {
    Close as CloseIcon,
    CloudUpload as UploadIcon,
    DateRange as DateIcon,
    AccessTime as TimeIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// ============================================
// Styled Components
// ============================================

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '24px',
        padding: theme.spacing(2),
        minWidth: '400px',
        maxWidth: '90%',
    },
}));

const DialogHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
}));

const UploadBox = styled(Box)(({ theme }) => ({
    border: '2px dashed #e0e0e0',
    borderRadius: '16px',
    padding: theme.spacing(3),
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: `${theme.palette.primary.main}08`,
    },
}));

const FileInput = styled('input')({
    display: 'none',
});

// ============================================
// Component
// ============================================

const requestTypes = [
    { value: 'annual', label: 'Annual Leave' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'emergency', label: 'Emergency Leave' },
    { value: 'dayoff', label: 'Day Off' },
];

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
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({
                ...prev,
                file: e.target.files[0],
            }));
        }
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
        // Reset form safely if needed, or rely on unmount
    };

    const isPartialDay = formData.type === 'emergency'; // Example logic for showing time

    return (
        <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogHeader>
                <Typography variant="h5" fontWeight={700}>
                    Request Time Off
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogHeader>

            <DialogContent sx={{ p: 1 }}>
                <Stack spacing={3}>
                    {/* Request Type */}
                    <TextField
                        select
                        label="Request Type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    >
                        {requestTypes.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Dates Row */}
                    <Stack direction="row" spacing={2}>
                        <TextField
                            type="date"
                            label="From Date"
                            name="fromDate"
                            value={formData.fromDate}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                        <TextField
                            type="date"
                            label="To Date"
                            name="toDate"
                            value={formData.toDate}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Stack>

                    {/* Time Row (Conditional) */}
                    {isPartialDay && (
                        <Stack direction="row" spacing={2}>
                            <TextField
                                type="time"
                                label="From Time"
                                name="fromTime"
                                value={formData.fromTime}
                                onChange={handleChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                            <TextField
                                type="time"
                                label="To Time"
                                name="toTime"
                                value={formData.toTime}
                                onChange={handleChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Stack>
                    )}

                    {/* File Upload */}
                    <Box>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Attachment (Optional)
                        </Typography>
                        <label htmlFor="file-upload">
                            <FileInput
                                accept="image/*,.pdf"
                                id="file-upload"
                                type="file"
                                onChange={handleFileChange}
                            />
                            <UploadBox>
                                <UploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                    {formData.file ? formData.file.name : 'Click to Upload Report or Image'}
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
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button
                    onClick={onClose}
                    variant="text"
                    color="inherit"
                    sx={{ borderRadius: '12px', px: 3, fontWeight: 600 }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{ borderRadius: '12px', px: 4, py: 1, fontWeight: 700, boxShadow: 'none' }}
                >
                    Submit Request
                </Button>
            </DialogActions>
        </StyledDialog>
    );
};

export default VacationRequestModal;
