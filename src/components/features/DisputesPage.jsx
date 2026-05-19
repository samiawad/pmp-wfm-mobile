import React, { useState } from 'react';
import {
    Box, Typography, MenuItem, TextField,
    SwipeableDrawer, Divider, IconButton, Fab, Chip,
} from '@mui/material';
import {
    CheckCircle as ApprovedIcon,
    Cancel as RejectedIcon,
    HourglassEmpty as PendingIcon,
    FilterAlt as FilterIcon,
    Close as CloseIcon,
    ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

// ── Mock data ─────────────────────────────────────────────────────────────────
const mockDisputes = [
    { id: 1, kpi: 'Quality Score',  reason: 'Evaluation Error',   date: '2023-10-25', status: 'Pending',  reference: 'QA-1023'   },
    { id: 2, kpi: 'Adherence',      reason: 'System Downtime',    date: '2023-10-22', status: 'Approved', reference: 'SYS-554'   },
    { id: 3, kpi: 'AHT',            reason: 'Complex Caller',     date: '2023-10-20', status: 'Rejected', reference: 'CALL-998'  },
    { id: 4, kpi: 'Quality Score',  reason: 'Misinterpretation',  date: '2023-10-18', status: 'Approved', reference: 'QA-1011'   },
    { id: 5, kpi: 'Attendance',     reason: 'Shift Swap Issue',   date: '2023-10-15', status: 'Pending',  reference: 'SCH-772'   },
];

const kpiOptions    = ['All', 'Quality Score', 'Adherence', 'AHT', 'Attendance'];
const reasonOptions = ['All', 'Evaluation Error', 'System Downtime', 'Complex Caller', 'Misinterpretation', 'Shift Swap Issue'];

// ── Helpers ───────────────────────────────────────────────────────────────────
const statusConfig = {
    Approved: { color: '#22c55e', bg: '#f0fdf4', icon: <ApprovedIcon sx={{ fontSize: 15 }} /> },
    Rejected: { color: '#ef4444', bg: '#fef2f2', icon: <RejectedIcon sx={{ fontSize: 15 }} /> },
    Pending:  { color: '#f59e0b', bg: '#fffbeb', icon: <PendingIcon  sx={{ fontSize: 15 }} /> },
};

const DragHandle = () => (
    <Box sx={{ width: 36, height: 4, borderRadius: 2, bgcolor: '#d0d0d0', margin: '12px auto 8px' }} />
);

// ── Component ─────────────────────────────────────────────────────────────────
// IONIC MIGRATION: replace SwipeableDrawer with <IonModal> sheet
const DisputesPage = () => {
    // Filter state
    const [selectedKPI,    setSelectedKPI]    = useState('All');
    const [selectedReason, setSelectedReason] = useState('All');
    const [selectedDate,   setSelectedDate]   = useState('');

    // Draft filter state (inside sheet, applied on "Apply")
    const [draftKPI,    setDraftKPI]    = useState('All');
    const [draftReason, setDraftReason] = useState('All');
    const [draftDate,   setDraftDate]   = useState('');

    // Sheet visibility
    const [filterOpen, setFilterOpen]   = useState(false);
    const [detailOpen, setDetailOpen]   = useState(false);
    const [activeDispute, setActiveDispute] = useState(null);

    const openFilter = () => {
        setDraftKPI(selectedKPI);
        setDraftReason(selectedReason);
        setDraftDate(selectedDate);
        setFilterOpen(true);
    };

    const applyFilters = () => {
        setSelectedKPI(draftKPI);
        setSelectedReason(draftReason);
        setSelectedDate(draftDate);
        setFilterOpen(false);
    };

    const clearFilters = () => {
        setDraftKPI('All');
        setDraftReason('All');
        setDraftDate('');
    };

    const openDetail = (dispute) => {
        setActiveDispute(dispute);
        setDetailOpen(true);
    };

    const filteredDisputes = mockDisputes.filter(d => {
        const matchKPI    = selectedKPI    === 'All' || d.kpi    === selectedKPI;
        const matchReason = selectedReason === 'All' || d.reason === selectedReason;
        const matchDate   = !selectedDate  || d.date === selectedDate;
        return matchKPI && matchReason && matchDate;
    });

    const hasActiveFilters =
        selectedKPI !== 'All' || selectedReason !== 'All' || selectedDate !== '';

    return (
        <Box sx={{ px: 2, pt: 1.5, pb: 10, bgcolor: '#f5f5f5', minHeight: '100vh' }}>

            {/* ── Active filter chips (if any) ── */}
            {hasActiveFilters && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
                    {selectedKPI !== 'All' && (
                        <Chip
                            label={selectedKPI}
                            size="small"
                            onDelete={() => setSelectedKPI('All')}
                            sx={{ fontSize: '0.72rem', height: 26, bgcolor: '#e8edf2', fontWeight: 600 }}
                        />
                    )}
                    {selectedReason !== 'All' && (
                        <Chip
                            label={selectedReason}
                            size="small"
                            onDelete={() => setSelectedReason('All')}
                            sx={{ fontSize: '0.72rem', height: 26, bgcolor: '#e8edf2', fontWeight: 600 }}
                        />
                    )}
                    {selectedDate && (
                        <Chip
                            label={selectedDate}
                            size="small"
                            onDelete={() => setSelectedDate('')}
                            sx={{ fontSize: '0.72rem', height: 26, bgcolor: '#e8edf2', fontWeight: 600 }}
                        />
                    )}
                </Box>
            )}

            {/* ── Disputes list ── */}
            {filteredDisputes.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {filteredDisputes.map((dispute, index) => {
                        const cfg     = statusConfig[dispute.status] ?? statusConfig.Pending;
                        const isLast  = index === filteredDisputes.length - 1;

                        return (
                            <Box
                                key={dispute.id}
                                onClick={() => openDetail(dispute)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    bgcolor: '#fff',
                                    px: 2,
                                    py: 1.5,
                                    cursor: 'pointer',
                                    borderRadius: index === 0
                                        ? '12px 12px 0 0'
                                        : isLast
                                            ? '0 0 12px 12px'
                                            : 0,
                                    borderBottom: isLast ? 'none' : '1px solid #f0f0f0',
                                    '&:active': { bgcolor: '#f9fafb' },
                                    transition: 'background 0.15s',
                                }}
                            >
                                {/* Status dot */}
                                <Box sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    bgcolor: cfg.color,
                                    flexShrink: 0,
                                }} />

                                {/* Content */}
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a1a' }}>
                                            {dispute.kpi}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.7rem', color: '#aaa', flexShrink: 0, ml: 1 }}>
                                            {dispute.date}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.25 }}>
                                        <Typography sx={{
                                            fontSize: '0.78rem',
                                            color: '#666',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            flex: 1,
                                            mr: 1,
                                        }}>
                                            {dispute.reason}
                                        </Typography>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.4,
                                            px: 0.75,
                                            py: 0.25,
                                            borderRadius: '6px',
                                            bgcolor: cfg.bg,
                                            flexShrink: 0,
                                        }}>
                                            <Box sx={{ color: cfg.color, display: 'flex', alignItems: 'center' }}>
                                                {cfg.icon}
                                            </Box>
                                            <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: cfg.color }}>
                                                {dispute.status}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                <ChevronRightIcon sx={{ fontSize: 18, color: '#ccc', flexShrink: 0 }} />
                            </Box>
                        );
                    })}
                </Box>
            ) : (
                <Box sx={{ textAlign: 'center', mt: 6 }}>
                    <Typography sx={{ color: '#aaa', fontSize: '0.875rem' }}>
                        No disputes match the current filters.
                    </Typography>
                    <Box
                        onClick={() => { setSelectedKPI('All'); setSelectedReason('All'); setSelectedDate(''); }}
                        sx={{ mt: 1.5, color: 'var(--primary-color)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                        Clear filters
                    </Box>
                </Box>
            )}

            {/* ── Floating filter FAB ── */}
            {/* IONIC MIGRATION: replace with <IonFab> */}
            <Fab
                size="medium"
                onClick={openFilter}
                sx={{
                    position: 'fixed',
                    bottom: 82,
                    right: 18,
                    width: 52,
                    height: 52,
                    bgcolor: 'var(--primary-color)',
                    color: '#fff',
                    boxShadow: '0 4px 14px rgba(6,24,54,0.28)',
                    '&:hover': { bgcolor: 'var(--primary-color)', opacity: 0.92 },
                    zIndex: 999,
                }}
            >
                <FilterIcon />
            </Fab>

            {/* ── Filter sheet ── */}
            <SwipeableDrawer
                anchor="bottom"
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                onOpen={() => setFilterOpen(true)}
                PaperProps={{
                    sx: { borderTopLeftRadius: 24, borderTopRightRadius: 24, pb: 4 },
                }}
            >
                <DragHandle />
                <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pb: 1.5 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography fontWeight={700} fontSize="1rem">Filters</Typography>
                    </Box>
                    <IconButton size="small" onClick={() => setFilterOpen(false)}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
                <Divider />

                <Box sx={{ px: 2, pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* KPI filter */}
                    <TextField
                        select
                        label="KPI"
                        value={draftKPI}
                        onChange={e => setDraftKPI(e.target.value)}
                        size="small"
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: '10px' },
                        }}
                    >
                        {kpiOptions.map(opt => (
                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                        ))}
                    </TextField>

                    {/* Reason filter */}
                    <TextField
                        select
                        label="Reason"
                        value={draftReason}
                        onChange={e => setDraftReason(e.target.value)}
                        size="small"
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: '10px' },
                        }}
                    >
                        {reasonOptions.map(opt => (
                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                        ))}
                    </TextField>

                    {/* Date filter */}
                    <TextField
                        type="date"
                        label="Date"
                        value={draftDate}
                        onChange={e => setDraftDate(e.target.value)}
                        size="small"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: '10px' },
                        }}
                    />

                    {/* Actions row */}
                    <Box sx={{ display: 'flex', gap: 1.5, mt: 0.5 }}>
                        <Box
                            onClick={clearFilters}
                            sx={{
                                flex: 1,
                                py: 1.5,
                                borderRadius: 3,
                                border: '1.5px solid #e0e0e0',
                                textAlign: 'center',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                color: '#666',
                                cursor: 'pointer',
                                '&:active': { bgcolor: '#f5f5f5' },
                            }}
                        >
                            Clear
                        </Box>
                        <Box
                            onClick={applyFilters}
                            sx={{
                                flex: 2,
                                py: 1.5,
                                borderRadius: 3,
                                bgcolor: 'var(--primary-color)',
                                textAlign: 'center',
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                color: '#fff',
                                cursor: 'pointer',
                                '&:active': { opacity: 0.88 },
                            }}
                        >
                            Apply Filters
                        </Box>
                    </Box>
                </Box>
            </SwipeableDrawer>

            {/* ── Dispute detail sheet ── */}
            <SwipeableDrawer
                anchor="bottom"
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                onOpen={() => setDetailOpen(true)}
                PaperProps={{
                    sx: { borderTopLeftRadius: 24, borderTopRightRadius: 24, pb: 4 },
                }}
            >
                <DragHandle />
                <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pb: 1.5 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography fontWeight={700} fontSize="1rem">Dispute Details</Typography>
                        {activeDispute && (
                            <Typography fontSize="0.78rem" color="text.secondary">
                                Ref: {activeDispute.reference}
                            </Typography>
                        )}
                    </Box>
                    <IconButton size="small" onClick={() => setDetailOpen(false)}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
                <Divider />

                {activeDispute && (() => {
                    const cfg = statusConfig[activeDispute.status] ?? statusConfig.Pending;
                    const rows = [
                        { label: 'KPI',       value: activeDispute.kpi },
                        { label: 'Reason',    value: activeDispute.reason },
                        { label: 'Date',      value: activeDispute.date },
                        { label: 'Reference', value: activeDispute.reference },
                    ];
                    return (
                        <Box sx={{ px: 2, pt: 2 }}>
                            {/* Status badge */}
                            <Box sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.75,
                                px: 1.5,
                                py: 0.75,
                                borderRadius: '10px',
                                bgcolor: cfg.bg,
                                mb: 2.5,
                            }}>
                                <Box sx={{ color: cfg.color, display: 'flex' }}>{cfg.icon}</Box>
                                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: cfg.color }}>
                                    {activeDispute.status}
                                </Typography>
                            </Box>

                            {/* Info rows */}
                            <Box sx={{ bgcolor: '#f9fafb', borderRadius: '12px', border: '1px solid #eef2f6', overflow: 'hidden' }}>
                                {rows.map((row, i) => (
                                    <React.Fragment key={row.label}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.25 }}>
                                            <Typography sx={{ fontSize: '0.78rem', color: '#888', fontWeight: 500 }}>
                                                {row.label}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a' }}>
                                                {row.value}
                                            </Typography>
                                        </Box>
                                        {i < rows.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </Box>
                        </Box>
                    );
                })()}
            </SwipeableDrawer>
        </Box>
    );
};

export default DisputesPage;
