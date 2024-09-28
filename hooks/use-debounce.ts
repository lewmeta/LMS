import { useEffect, useState } from 'react';

// Only when a user stops typing for at least 500 ms then we will search
// against the database, this prevents us from making too many requests

export function useDebounce<T>(value: T, delay: number): T {
    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceValue(value);
        }, delay || 500);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debounceValue;
}