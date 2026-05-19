import { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Typography,
    IconButton,
    FormHelperText,
} from '@mui/material';
import {
    Close as CloseIcon,
    CloudUpload as UploadIcon,
} from '@mui/icons-material';

// ============================================
// Styled Components
// ============================================

const StyledDialog = styled(Dialog)({
    '& .MuiDialog-paper': {
        borderRadius: '20px',
        margin: '16px',
        width: 'calc(100% - 32px)',
        maxWidth: '500px',
        overflow: 'hidden',
    },
});

const ModalHeader = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 20px 16px',
    backgroundColor: 'var(--primary-color)',
});

// Shared field style — matches the rest of the app modals
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
    '& .MuiFormHelperText-root': { marginLeft: 0 },
};

const formControlSx = {
    ...fieldSx,
    '& .MuiOutlinedInput-root': {
        ...fieldSx['& .MuiOutlinedInput-root'],
    },
};

const UploadBox = styled(Box)({
    border: '1.5px dashed #c5cdd8',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#f5f7fa',
    transition: 'all 0.2s',
    '&:hover': {
        borderColor: 'var(--primary-color)',
        backgroundColor: 'rgba(var(--primary-rgb), 0.04)',
    },
});

const FileName = styled(Typography)({
    marginTop: '6px',
    fontSize: '0.8rem',
    color: '#94a3b8',
});

// ============================================
// Dispute Reasons
// ============================================

const disputeReasons = [
    'Incorrect Data Entry',
    'System Error',
    'Technical Issue',
    'Unfair Evaluation',
    'Missing Context',
    'External Factors',
    'Training Period',
    'Other',
];

// ============================================
// Component
// ============================================

const DisputeModal = ({
    open,
    onClose,
    onSubmit,
    prefilledData = null, // { kpiId, kpiName, period, periodReadOnly }
    kpiList = [], // List of available KPIs for selection
}) => {
    const [formData, setFormData] = useState({
        kpiId: prefilledData?.kpiId || '',
        kpiName: prefilledData?.kpiName || '',
        period: prefilledData?.period || '',
        startDate: prefilledData?.startDate || '',
        endDate: prefilledData?.endDate || '',
        reason: '',
        reference: '',
        comment: '',
        file: null,
    });

    const [errors, setErrors] = useState({});

    const isPeriodReadOnly = prefilledData?.periodReadOnly || false;
    const isKPIReadOnly = !!prefilledData?.kpiId;

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: '',
            }));
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                file,
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!isKPIReadOnly && !formData.kpiId) {
            newErrors.kpiId = 'KPI is required';
        }

        if (!isPeriodReadOnly && !formData.startDate) {
            newErrors.startDate = 'Start date is required';
        }

        if (!isPeriodReadOnly && !formData.endDate) {
            newErrors.endDate = 'End date is required';
        }

        if (!formData.reason) {
            newErrors.reason = 'Dispute reason is required';
        }

        if (!formData.comment) {
            newErrors.comment = 'Comment is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit(formData);
            handleClose();
        }
    };

    const handleClose = () => {
        // Reset form
        setFormData({
            kpiId: prefilledData?.kpiId || '',
            kpiName: prefilledData?.kpiName || '',
            period: prefilledData?.period || '',
            startDate: prefilledData?.startDate || '',
            endDate: prefilledData?.endDate || '',
            reason: '',
            reference: '',
            comment: '',
            file: null,
        });
        setErrors({});
        onClose();
    };

    // Don't render anything if modal is not open to avoid date-fns import errors
    if (!open) {
        return null;
    }

    return (
        <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>

            {/* Branded header */}
            <ModalHeader>
                <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>
                        Create Dispute
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)', mt: 0.25 }}>
                        Fill in the details below
                    </Typography>
                </Box>
                <IconButton onClick={handleClose} size="small" sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)' } }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </ModalHeader>

            <DialogContent sx={{ px: 2.5, pt: 2.5, pb: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                    {/* KPI Selection */}
                    {isKPIReadOnly ? (
                        <TextField
                            label="KPI Name"
                            value={formData.kpiName}
                            fullWidth
                            InputProps={{ readOnly: true }}
                            variant="outlined"
                            sx={fieldSx}
                        />
                    ) : (
                        <FormControl fullWidth error={!!errors.kpiId} sx={formControlSx}>
                            <InputLabel>KPI Name *</InputLabel>
                            <Select
                                value={formData.kpiId}
                                onChange={(e) => {
                                    const selectedKPI = kpiList.find(k => k.id === e.target.value);
                                    handleChange('kpiId', e.target.value);
                                    handleChange('kpiName', selectedKPI?.fullName || '');
                                }}
                                label="KPI Name *"
                            >
                                {kpiList.map(kpi => (
                                    <MenuItem key={kpi.id} value={kpi.id}>
                                        {kpi.fullName}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.kpiId && <FormHelperText>{errors.kpiId}</FormHelperText>}
                        </FormControl>
                    )}

                    {/* Period Selection */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <TextField
                                label="Start Date *"
                                type="date"
                                value={formData.startDate || ''}
                                onChange={(e) => handleChange('startDate', e.target.value)}
                                fullWidth
                                error={!!errors.startDate}
                                helperText={errors.startDate}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ readOnly: isPeriodReadOnly }}
                                sx={fieldSx}
                            />
                            <TextField
                                label="End Date *"
                                type="date"
                                value={formData.endDate || ''}
                                onChange={(e) => handleChange('endDate', e.target.value)}
                                fullWidth
                                error={!!errors.endDate}
                                helperText={errors.endDate}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ readOnly: isPeriodReadOnly }}
                                sx={fieldSx}
                            />
                        </Box>

                        {isPeriodReadOnly && (
                            <TextField
                                label="Time / Interval"
                                value={formData.period}
                                fullWidth
                                InputProps={{ readOnly: true }}
                                variant="outlined"
                                sx={fieldSx}
                            />
                        )}
                    </Box>

                    {/* Dispute Reason */}
                    <FormControl fullWidth error={!!errors.reason} sx={formControlSx}>
                        <InputLabel>Dispute Reason *</InputLabel>
                        <Select
                            value={formData.reason}
                            onChange={(e) => handleChange('reason', e.target.value)}
                            label="Dispute Reason *"
                        >
                            {disputeReasons.map(reason => (
                                <MenuItem key={reason} value={reason}>
                                    {reason}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.reason && <FormHelperText>{errors.reason}</FormHelperText>}
                    </FormControl>

                    {/* Reference Field */}
                    <TextField
                        label="Reference"
                        value={formData.reference}
                        onChange={(e) => handleChange('reference', e.target.value)}
                        fullWidth
                        variant="outlined"
                        placeholder="e.g., Ticket #12345"
                        sx={fieldSx}
                    />

                    {/* Comment Field */}
                    <TextField
                        label="Comment *"
                        value={formData.comment}
                        onChange={(e) => handleChange('comment', e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        error={!!errors.comment}
                        helperText={errors.comment || 'Please provide detailed information about your dispute'}
                        placeholder="Explain the reason for your dispute..."
                        sx={fieldSx}
                    />

                    {/* File Upload */}
                    <Box>
                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', mb: 0.75 }}>
                            Attachment (Optional)
                        </Typography>
                        <input
                            accept="image/*,.pdf,.doc,.docx"
                            style={{ display: 'none' }}
                            id="dispute-file-upload"
                            type="file"
                            onChange={handleFileUpload}
                        />
                        <label htmlFor="dispute-file-upload">
                            <UploadBox>
                                <UploadIcon sx={{ fontSize: 28, color: '#94a3b8', mb: 0.5 }} />
                                <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>
                                    {formData.file ? formData.file.name : 'Tap to attach a file or document'}
                                </Typography>
                            </UploadBox>
                        </label>
                        {formData.file && (
                            <FileName>Selected: {formData.file.name}</FileName>
                        )}
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 2.5, pb: 2.5, pt: 1.5, gap: 1 }}>
                <Button
                    onClick={handleClose}
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
                        '&:hover': { backgroundColor: 'var(--primary-color)', boxShadow: 'none' },
                    }}
                >
                    Submit Dispute
                </Button>
            </DialogActions>
        </StyledDialog>
    );
};

export default DisputeModal;
