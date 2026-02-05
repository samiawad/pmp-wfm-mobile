import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [requests, setRequests] = useState([]);
    const [user, setUser] = useState({
        name: 'Sami Awad',
        role: 'Agent',
        avatar: 'https://i.pravatar.cc/150?img=12'
    });

    // Load from local storage on mount
    useEffect(() => {
        const savedRequests = localStorage.getItem('wfm_requests');
        if (savedRequests) {
            setRequests(JSON.parse(savedRequests));
        }
    }, []);

    // Save request
    const addRequest = (type, data) => {
        const newRequest = {
            id: Date.now(),
            type,
            status: 'Pending',
            date: new Date().toISOString(),
            ...data
        };

        const updatedRequests = [newRequest, ...requests];
        setRequests(updatedRequests);
        localStorage.setItem('wfm_requests', JSON.stringify(updatedRequests));
        return newRequest;
    };

    // Mock Schedule Data
    const schedule = [
        { id: 1, date: 'Today', shift: '09:00 - 17:00', activity: 'Inbound Calls', status: 'Active' },
        { id: 2, date: 'Tomorrow', shift: '09:00 - 17:00', activity: 'Inbound Calls', status: 'Upcoming' },
        { id: 3, date: 'Fri, Feb 6', shift: '08:00 - 16:00', activity: 'Email Support', status: 'Upcoming' },
        { id: 4, date: 'Sat, Feb 7', shift: 'Off', activity: 'Weekend', status: 'Off' },
    ];

    // Mock Performance Data
    const kpis = [
        { label: 'AHT', value: '3m 12s', target: '3m 00s', status: 'warning' },
        { label: 'Occupancy', value: '88%', target: '85%', status: 'success' },
        { label: 'Adherence', value: '95%', target: '90%', status: 'success' },
    ];

    const value = {
        user,
        requests,
        addRequest,
        schedule,
        kpis
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
