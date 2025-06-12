import React, { useState, useEffect } from 'react';

interface DashboardTableProps<T> {
    data: T[];
    itemsPerPage?: number;
    renderRow: (item: T) => React.ReactNode;
    columns: string[];
    noData?: React.ReactNode;
}

export function DashboardTable<T>({
    data,
    itemsPerPage = 5,
    renderRow,
    columns,
    noData,
}: DashboardTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [data]);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col}
                                className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                            >
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {paginatedData.length > 0 ? (
                        paginatedData.map(renderRow)
                    ) : (
                        <tr>
                            <td colSpan={100} className="px-6 py-12 text-center">
                                {noData || <div>No data found</div>}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {data.length > itemsPerPage && (
                <div className="flex justify-end items-center px-6 py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 mx-1 text-sm rounded-lg border dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-700 dark:text-gray-300 mx-2">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 mx-1 text-sm rounded-lg border dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
