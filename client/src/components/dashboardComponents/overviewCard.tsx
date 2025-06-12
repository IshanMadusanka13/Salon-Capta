import React from 'react';

interface OverviewCardProps {
    icon: React.ReactNode;
    iconBgColor: string;
    title: string;
    value: string | number;
    prefix?: string;
}

const OverviewCard = ({ icon, iconBgColor, title, value, prefix = '' }: OverviewCardProps) => {
    return (
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                    <div className={`flex-shrink-0 ${iconBgColor} rounded-md p-3`}>
                        {icon}
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                {title}
                            </dt>
                            <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {prefix} {value}
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default OverviewCard;
