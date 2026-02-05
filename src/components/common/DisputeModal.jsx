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

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '16px',
        maxWidth: '500px',
        width: '100%',
    },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: theme.spacing(1),
    borderBottom: '1px solid #e0e0e0',
}));

const UploadButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(1),
    textTransform: 'none',
    borderRadius: '8px',
}));

const FileName = styled(Typography)(({ theme }) => ({
    marginTop: theme.spacing(1),
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
}));

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
            <StyledDialogTitle>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Create Dispute
                </Typography>
                <IconButton onClick={handleClose} size="small">
                    <CloseIcon />
                </IconButton>
            </StyledDialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {/* KPI Selection */}
                    {isKPIReadOnly ? (
                        <TextField
                            label="KPI Name"
                            value={formData.kpiName}
                            fullWidth
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="outlined"
                        />
                    ) : (
                        <FormControl fullWidth error={!!errors.kpiId}>
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
                    {/* Period Selection */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Start Date *"
                                type="date"
                                value={formData.startDate || ''}
                                onChange={(e) => handleChange('startDate', e.target.value)}
                                fullWidth
                                error={!!errors.startDate}
                                helperText={errors.startDate}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    readOnly: isPeriodReadOnly,
                                }}
                            />
                            <TextField
                                label="End Date *"
                                type="date"
                                value={formData.endDate || ''}
                                onChange={(e) => handleChange('endDate', e.target.value)}
                                fullWidth
                                error={!!errors.endDate}
                                helperText={errors.endDate}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    readOnly: isPeriodReadOnly,
                                }}
                            />
                        </Box>

                        {isPeriodReadOnly && (
                            <TextField
                                label="Time / Interval"
                                value={formData.period}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="outlined"
                            />
                        )}
                    </Box>

                    {/* Dispute Reason */}
                    <FormControl fullWidth error={!!errors.reason}>
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
                    />

                    {/* File Upload */}
                    <Box>
                        <input
                            accept="image/*,.pdf,.doc,.docx"
                            style={{ display: 'none' }}
                            id="dispute-file-upload"
                            type="file"
                            onChange={handleFileUpload}
                        />
                        <label htmlFor="dispute-file-upload">
                            <UploadButton
                                variant="outlined"
                                component="span"
                                startIcon={<UploadIcon />}
                                fullWidth
                            >
                                Upload Supporting Document (Optional)
                            </UploadButton>
                        </label>
                        {formData.file && (
                            <FileName>
                                Selected: {formData.file.name}
                            </FileName>
                        )}
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2.5, pt: 2 }}>
                <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: '8px' }}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #5568d3 0%, #6a4190 100%)',
                        },
                    }}
                >
                    Submit Dispute
                </Button>
            </DialogActions>
        </StyledDialog>
    );
};

export default DisputeModal;
