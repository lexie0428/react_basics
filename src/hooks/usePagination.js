import { useMemo } from 'react';

export const usePagination = (totalPages) => {
    const pages = useMemo(() => {
        const result = []
        for (let i = 0; i < totalPages; i++) {
            result.push(i + 1)
        }
        return result
    }, [totalPages])
    return pages
}