/**
 * useUrlState — reads URL search params and exposes a typed urlState object.
 * Used by the Figma scraper to deep-link into any UI state without manual clicking.
 *
 * Supported params:
 *   ?view=    — page to render (home | schedule | dayTimeline | performance | rewards | ...)
 *   ?subview= — sub-view within a page (e.g. 'cards' inside schedule)
 *   ?slide=   — hero carousel slide index (0 | 1 | 2)
 *   ?tab=     — gamification tab (competitions | trophies | leaderboard)
 *   ?overlay= — overlay to open immediately (more_menu | filter_sheet | period_selector |
 *                level_up_celebration | notifications | shift_detail | request_sheet |
 *                request_day_off | request_personal_leave | request_sick_leave |
 *                request_sick_day_off | request_shift_swap | request_break_swap |
 *                request_day_off_swap)
 */

import { useMemo } from 'react';

const useUrlState = () => {
    const urlState = useMemo(() => {
        const params = new URLSearchParams(window.location.search);

        const view = params.get('view') || null;
        const overlay = params.get('overlay') || null;
        const tab = params.get('tab') || null;
        const subview = params.get('subview') || null;
        const slideRaw = params.get('slide');
        const slide = slideRaw !== null ? parseInt(slideRaw, 10) : 0;

        return {
            view,
            overlay,
            tab,
            subview,
            slide: isNaN(slide) ? 0 : slide,
            /** True when ANY url param is set — used to disable animations. */
            isUrlDriven: !!(view || overlay || tab || subview || slideRaw !== null),
        };
    }, []);

    return urlState;
};

export default useUrlState;
