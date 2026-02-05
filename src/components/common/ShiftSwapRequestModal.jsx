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
    Autocomplete,
} from '@mui/material';
import {
    Close as CloseIcon,
    SwapHoriz as SwapIcon,
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

// ============================================
// Data
// ============================================

const swapTypes = [
    { value: 'shift', label: 'Shift Swap' },
    { value: 'dayoff', label: 'Day Off Swap' },
    { value: 'break', label: 'Break Swap' },
];

const colleagues = [
    "Ahmed Al-Sayed", "Fatima Al-Harbi", "Mahmoud Ali", "Sara Hassan",
    "Omar Khaled", "Zainab Hussein", "Youssef Ibrahim", "Layla Mohammed",
    "Hassan Abdullah", "Nour El-Din", "Khalid Al-Otaibi", "Mariam Al-Ghamdi",
    "Sultan Al-Saud", "Reem Al-Faisal", "Abdullah Al-Rashid", "Huda Al-Mansour",
    "Fahad Al-Zahrani", "Amal Al-Qhtani", "Tariq Al-Jaber", "Mona Al-Ali"
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
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSwapWithChange = (event, newValue) => {
        setFormData((prev) => ({
            ...prev,
            swapWith: newValue,
        }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
    };

    return (
        <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogHeader>
                <Typography variant="h5" fontWeight={700}>
                    Request Swap
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogHeader>

            <DialogContent sx={{ p: 1 }}>
                <Stack spacing={3}>
                    {/* Swap Type */}
                    <TextField
                        select
                        label="Swap Type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    >
                        {swapTypes.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
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
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />

                    {/* Swap With (Autocomplete) */}
                    <Autocomplete
                        options={colleagues}
                        value={formData.swapWith}
                        onChange={handleSwapWithChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Swap With"
                                placeholder="Select colleague"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        )}
                    />

                    {/* Time (Conditional - mainly for Break or Shift if needed, adding just in case) */}
                    {formData.type !== 'dayoff' && (
                        <TextField
                            type="time"
                            label="Target Time"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
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

export default ShiftSwapRequestModal;
