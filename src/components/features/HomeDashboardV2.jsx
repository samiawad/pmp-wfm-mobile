import { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Grid,
    LinearProgress,
} from '@mui/material';
import {
    Schedule as ScheduleIcon,
    Assessment as ScorecardIcon,
    CalendarToday as CalendarIcon,
    AssignmentTurnedIn as RequestsIcon,
    RateReview as EvaluationIcon,
    NotificationImportant as AlertIcon,
    School as CoachingIcon,
    CardGiftcard as RewardsIcon,
    ChevronRight as ChevronRightIcon,
    Warning as WarningIcon,
    SwapHoriz as SwapIcon,
} from '@mui/icons-material';

// ============================================
// Design Tokens
// ============================================
const C = {
    // ── Brand tokens (driven by CSS variables — change in index.css) ──
    primary: 'var(--primary-color)',
    secondary: 'var(--secondary-color)',
    // Alpha helpers — inline where needed, e.g. rgba(var(--primary-rgb), 0.08)

    // ── Surface / neutral ─────────────────────────────────────────────
    surface: '#ffffff',
    bg: '#f4f6f9',
    text1: '#1a1a1a',
    text2: '#555',
    text3: '#9e9e9e',
    border: '#ebebeb',

    // ── Semantic status colors ────────────────────────────────────────
    green: '#2e7d32', greenBg: '#e8f5e9',
    orange: '#e65100', orangeBg: '#fff3e0',
    red: '#c62828', redBg: '#ffebee',
    purple: '#6a1b9a', purpleBg: '#f3e5f5',
    teal: '#00695c', tealBg: '#e0f2f1',
    amber: '#f57f17', amberBg: '#fff8e1',
};

// ============================================
// Hero Card — static (no carousel)
// ============================================
const HERO = {
    icon: <ScorecardIcon sx={{ fontSize: 20 }} />,
    iconColor: C.primary,
    label: 'My Day',
    cta: 'View performance',
    target: 'performance',
};

// ============================================
// Component
// ============================================

const HomeDashboardV2 = ({ onAction, onPageChange, onDayClick }) => {

    // ── Quick-access grid cards ─────────────
    // iconBg is pre-computed to avoid CSS-var-in-template-literal issues
    const gridCards = [
        {
            icon: <CalendarIcon sx={{ fontSize: 22 }} />,
            iconColor: C.primary,
            iconBg: 'rgba(var(--primary-rgb), 0.08)',
            label: 'Schedule',
            metric: '09:00 – 17:00',
            sub: 'Today',
            onClick: () => onPageChange?.('schedule'),
        },
        {
            icon: <RequestsIcon sx={{ fontSize: 22 }} />,
            iconColor: C.orange,
            iconBg: `${C.orange}15`,
            label: 'Requests',
            metric: '2',
            sub: 'Pending',
            badge: '2',
            badgeColor: C.orange,
            onClick: () => onPageChange?.('requests'),
        },
        {
            icon: <EvaluationIcon sx={{ fontSize: 22 }} />,
            iconColor: C.purple,
            iconBg: `${C.purple}15`,
            label: 'Evaluations',
            metric: '92%',
            sub: 'Last score',
            onClick: () => onPageChange?.('evaluations'),
        },
        {
            icon: <AlertIcon sx={{ fontSize: 22 }} />,
            iconColor: C.red,
            iconBg: `${C.red}15`,
            label: 'Alerts',
            metric: '1',
            sub: 'Active now',
            badge: '!',
            badgeColor: C.red,
            onClick: () => onPageChange?.('activities'),
        },
        {
            icon: <CoachingIcon sx={{ fontSize: 22 }} />,
            iconColor: C.teal,
            iconBg: `${C.teal}15`,
            label: 'Coaching',
            metric: '2:00 PM',
            sub: 'Today',
            onClick: () => onPageChange?.('coaching'),
        },
        {
            icon: <RewardsIcon sx={{ fontSize: 22 }} />,
            iconColor: C.amber,
            iconBg: `${C.amber}15`,
            label: 'Rewards',
            metric: '1,120',
            sub: 'exp  ·  Level 5',
            onClick: () => onPageChange?.('rewards'),
        },
    ];

    // ── Pending action items ────────────────
    const actionItems = [
        {
            icon: <SwapIcon sx={{ fontSize: 18 }} />,
            iconColor: C.primary,
            iconBg: 'rgba(var(--primary-rgb), 0.07)',
            chip: 'WFM',
            chipColor: C.primary,
            chipBg: 'rgba(var(--primary-rgb), 0.07)',
            action: () => onAction?.('requests', 3),
            label: 'Shift Swap',
        },
        {
            icon: <SwapIcon sx={{ fontSize: 18 }} />,
            iconColor: C.primary,
            iconBg: 'rgba(var(--primary-rgb), 0.07)',
            chip: 'WFM',
            chipColor: C.primary,
            chipBg: 'rgba(var(--primary-rgb), 0.07)',
            action: () => onAction?.('requests', 3),
            label: 'Day Off Swap',
        },
    ];

    // ── Hero card: KPIs colored by achievement level ─────
    // Red = needs attention, Orange = acceptable, Green = on target
    const perfKPIs = [
        { label: 'AHT', value: '252s', color: C.red },  // above target
        { label: 'Adherence', value: '92%', color: C.green },  // on target
        { label: 'Tagging', value: '89%', color: C.orange },  // below target
    ];

    return (
        <Box sx={{ minHeight: '100%', backgroundColor: C.bg }}>

            {/* ════════════════════════════════════════
                BLUE HEADER — ~28-30% of screen height
                AppBar is hidden on this page
                ════════════════════════════════════════ */}
            <Box sx={{
                backgroundColor: C.primary,
                minHeight: '30vh',
                px: 2.5,
                pt: 'calc(env(safe-area-inset-top, 0px) + 28px)', // respect iOS notch
                pb: '100px',  // overlap space for the hero card
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
            }}>
                {/* Greeting block */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Box>
                        <Typography sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
                            Good morning,
                        </Typography>
                        <Typography sx={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff', lineHeight: 1.1, mt: 0.5 }}>
                            Sami 👋
                        </Typography>
                        <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', mt: 0.75, fontWeight: 500 }}>
                            Agent  ·  Customer Support
                        </Typography>
                    </Box>
                    <Chip
                        label="Tue, Feb 4"
                        size="small"
                        sx={{
                            mb: 0.5,
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '0.72rem',
                            border: '1px solid rgba(255,255,255,0.22)',
                        }}
                    />
                </Box>
            </Box>

            {/* ════════════════════════════════════════
                CONTENT — negative margin pulls it up
                into the blue header
                ════════════════════════════════════════ */}
            <Box sx={{ px: 2, mt: '-80px' }}>

                {/* ── Hero Card — My Day Performance ─── */}
                <Card sx={{
                    borderRadius: '20px',
                    border: 'none',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
                    mb: 2,
                    overflow: 'visible',
                }}>
                    <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>

                        {/* Card header: icon + label */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                            <Box sx={{
                                width: 34, height: 34, borderRadius: '10px',
                                backgroundColor: 'rgba(var(--primary-rgb), 0.08)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: HERO.iconColor,
                            }}>
                                {HERO.icon}
                            </Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: C.text2 }}>
                                {HERO.label}
                            </Typography>
                        </Box>

                        {/* KPI trio */}
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            {perfKPIs.map((kpi) => (
                                <Box key={kpi.label} sx={{
                                    flex: 1, textAlign: 'center',
                                    backgroundColor: `${kpi.color}0d`,
                                    borderRadius: '12px', py: 1.25,
                                    border: `1px solid ${kpi.color}20`,
                                }}>
                                    <Typography sx={{
                                        fontSize: '1.25rem', fontWeight: 800,
                                        color: kpi.color, lineHeight: 1, mb: 0.3,
                                    }}>
                                        {kpi.value}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.65rem', color: C.text3, fontWeight: 600, letterSpacing: '0.04em' }}>
                                        {kpi.label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                        {/* Scorecard bar */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.75 }}>
                            <Typography sx={{ fontSize: '0.78rem', color: C.text2, fontWeight: 600 }}>
                                Scorecard
                            </Typography>
                            <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: C.green }}>
                                85% <Typography component="span" sx={{ fontSize: '0.72rem', color: C.text3, fontWeight: 500 }}>/ 100%</Typography>
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={85}
                            sx={{
                                height: 5, borderRadius: 3, mb: 0.75,
                                backgroundColor: '#ebebeb',
                                '& .MuiLinearProgress-bar': { borderRadius: 3, backgroundColor: C.green },
                            }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: 16, height: 16, borderRadius: '4px',
                                backgroundColor: `${C.green}18`,
                            }}>
                                <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                                    <path d="M5 1.5L9 8H1L5 1.5Z" fill={C.green} />
                                </svg>
                            </Box>
                            <Typography sx={{ fontSize: '0.71rem', color: C.text3, fontWeight: 500 }}>
                                3% from yesterday  ·  Target: 90%
                            </Typography>
                        </Box>

                        {/* Divider + CTA */}
                        <Box sx={{ borderTop: `1px solid ${C.border}`, mt: 2, pt: 1.5 }}>
                            <Box
                                onClick={() => onPageChange?.(HERO.target)}
                                sx={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                                    cursor: 'pointer',
                                    '&:active': { opacity: 0.6 },
                                }}
                            >
                                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: HERO.iconColor }}>
                                    {HERO.cta}
                                </Typography>
                                <ChevronRightIcon sx={{ fontSize: 17, color: HERO.iconColor, ml: 0.25 }} />
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {/* ── Quick Access Grid ──────────────────── */}
                <Grid container spacing={'var(--card-spacing)'} sx={{ mb: 2 }}>
                    {gridCards.map((card, i) => (
                        <Grid item size={6} key={i} sx={{ display: 'flex' }}>
                            <Card
                                onClick={card.onClick}
                                sx={{
                                    flex: 1,
                                    borderRadius: '16px',
                                    border: `1px solid ${C.border}`,
                                    boxShadow: 'none',
                                    backgroundColor: C.surface,
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transition: 'transform 0.1s ease',
                                    '&:active': { transform: 'scale(0.96)' },
                                }}
                            >
                                {/* Notification badge */}
                                {card.badge && (
                                    <Box sx={{
                                        position: 'absolute', top: 10, right: 10,
                                        minWidth: 20, height: 20,
                                        borderRadius: '10px',
                                        backgroundColor: card.badgeColor,
                                        color: '#fff',
                                        fontSize: '0.62rem',
                                        fontWeight: 800,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        px: 0.5,
                                        boxShadow: `0 2px 6px ${card.badgeColor}55`,
                                        lineHeight: '0',
                                    }}>
                                        {card.badge}
                                    </Box>
                                )}

                                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                    {/* Icon box */}
                                    <Box sx={{
                                        width: 42, height: 42, borderRadius: '12px',
                                        backgroundColor: card.iconBg,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: card.iconColor, mb: 1.5,
                                    }}>
                                        {card.icon}
                                    </Box>

                                    {/* Feature label */}
                                    <Typography sx={{
                                        fontSize: '0.68rem', fontWeight: 600,
                                        color: C.text3, textTransform: 'uppercase',
                                        letterSpacing: '0.4px', mb: 0.25,
                                    }}>
                                        {card.label}
                                    </Typography>

                                    {/* Main metric */}
                                    <Typography sx={{
                                        fontSize: '1.3rem', fontWeight: 800,
                                        color: C.text1, lineHeight: 1.1, mb: 0.2,
                                    }}>
                                        {card.metric}
                                    </Typography>

                                    {/* Sub text */}
                                    <Typography sx={{ fontSize: '0.71rem', color: C.text3, fontWeight: 500 }}>
                                        {card.sub}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* ── Pending Actions Card ───────────────── */}
                <Card sx={{
                    borderRadius: '16px',
                    border: `1px solid ${C.border}`,
                    boxShadow: 'none',
                    backgroundColor: C.surface,
                    mb: 2,
                }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>

                        {/* Card header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <Box sx={{
                                width: 42, height: 42, borderRadius: '12px',
                                backgroundColor: `${C.orange}15`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: C.orange,
                            }}>
                                <WarningIcon sx={{ fontSize: 22 }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: C.text1 }}>
                                    Pending Actions
                                </Typography>
                                <Typography sx={{ fontSize: '0.75rem', color: C.text3, fontWeight: 500 }}>
                                    3 items need your attention
                                </Typography>
                            </Box>
                            {/* View all — navigates to Requests > Pending tab */}
                            <Typography
                                onClick={() => onAction?.('requests', 0)}
                                sx={{
                                    fontSize: '0.78rem', fontWeight: 700,
                                    color: C.primary, cursor: 'pointer',
                                    flexShrink: 0,
                                    '&:active': { opacity: 0.7 },
                                }}
                            >
                                View all
                            </Typography>
                        </Box>

                        {/* Action rows */}
                        {actionItems.map((item, i) => (
                            <Box
                                key={i}
                                onClick={item.action}
                                sx={{
                                    display: 'flex', alignItems: 'center', gap: 1.5,
                                    py: 1.25,
                                    borderTop: i === 0 ? `1px solid ${C.border}` : 'none',
                                    borderBottom: i < actionItems.length - 1 ? `1px solid ${C.border}` : 'none',
                                    cursor: 'pointer',
                                    '&:active': { backgroundColor: '#f9fafb' },
                                    mx: -2, px: 2,  // full-bleed tap highlight
                                }}
                            >
                                {/* Mini icon box */}
                                <Box sx={{
                                    width: 32, height: 32, borderRadius: '9px', flexShrink: 0,
                                    backgroundColor: item.iconBg,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: item.iconColor,
                                }}>
                                    {item.icon}
                                </Box>

                                {/* Label */}
                                <Typography sx={{
                                    flex: 1, fontSize: '0.83rem',
                                    color: C.text1, fontWeight: 500,
                                }}>
                                    {item.label}
                                </Typography>

                                {/* Module chip */}
                                <Chip
                                    label={item.chip}
                                    size="small"
                                    sx={{
                                        height: 20, fontSize: '0.65rem', fontWeight: 700,
                                        backgroundColor: item.chipBg,
                                        color: item.chipColor,
                                        border: `1px solid ${item.chipColor}25`,
                                        flexShrink: 0,
                                    }}
                                />
                                <ChevronRightIcon sx={{ fontSize: 16, color: C.text3, flexShrink: 0 }} />
                            </Box>
                        ))}
                    </CardContent>
                </Card>

                {/* Bottom spacer (above nav bar) */}
                <Box sx={{ height: 16 }} />
            </Box>
        </Box>
    );
};

export default HomeDashboardV2;
