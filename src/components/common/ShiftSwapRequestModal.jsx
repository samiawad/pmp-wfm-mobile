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
    Autocomplete,
} from '@mui/material';
import {
    Close as CloseIcon,
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

const ModalHeader = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 20px 16px',
    backgroundColor: 'var(--primary-color)',
});

// Shared field style — matches VacationRequestModal
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

// ============================================
// Data
// ============================================

const swapTypes = [
    { value: 'shift',  label: 'Shift Swap' },
    { value: 'dayoff', label: 'Day Off Swap' },
    { value: 'break',  label: 'Break Swap' },
];

const colleagues = [
    'Ahmed Al-Sayed', 'Fatima Al-Harbi', 'Mahmoud Ali', 'Sara Hassan',
    'Omar Khaled', 'Zainab Hussein', 'Youssef Ibrahim', 'Layla Mohammed',
    'Hassan Abdullah', 'Nour El-Din', 'Khalid Al-Otaibi', 'Mariam Al-Ghamdi',
    'Sultan Al-Saud', 'Reem Al-Faisal', 'Abdullah Al-Rashid', 'Huda Al-Mansour',
    'Fahad Al-Zahrani', 'Amal Al-Qhtani', 'Tariq Al-Jaber', 'Mona Al-Ali',
];

// ============================================
// Component
// ============================================

const ShiftSwapRequestModal = ({ open, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        type: 'shift',
        date: '',
        swapWith: '',
        comment: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSwapWithChange = (event, newValue) => {
        setFormData((prev) => ({ ...prev, swapWith: newValue }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
    };

    return (
        // IONIC MIGRATION: replace with <IonModal>
        <StyledDialog open={open} onClose={onClose} fullWidth>

            {/* Branded header */}
            <ModalHeader>
                <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>
                        Request Swap
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

                    {/* Swap Type */}
                    <TextField
                        select
                        label="Swap Type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        sx={fieldSx}
                    >
                        {swapTypes.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Date */}
                    <TextField
                        type="date"
                        label="Date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        sx={fieldSx}
                    />

                    {/* Swap With */}
                    <Autocomplete
                        options={colleagues}
                        value={formData.swapWith}
                        onChange={handleSwapWithChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Swap With"
                                placeholder="Select colleague"
                                sx={fieldSx}
                            />
                        )}
                    />

                    {/* Target Time — not for day-off swaps */}
                    {formData.type !== 'dayoff' && (
                        <TextField
                            type="time"
                            label="Target Time"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            sx={fieldSx}
                        />
                    )}

                    {/* Comment */}
                    <TextField
                        label="Reason / Comments"
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        multiline
                        rows={3}
                        fullWidth
                        placeholder="Why do you need this swap?"
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

export default ShiftSwapRequestModal;
