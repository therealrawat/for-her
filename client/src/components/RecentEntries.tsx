import { useState } from 'react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import type { Cycle } from '../types';

interface RecentEntriesProps {
    cycles: Cycle[];
}

const RecentEntries = ({ cycles }: RecentEntriesProps) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // Get the most recent 5 cycles
    const recentCycles = cycles.slice(0, 5);

    if (recentCycles.length === 0) {
        return (
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Entries</h3>
                <p className="text-sm text-gray-500">No entries yet. Start logging your cycles!</p>
            </div>
        );
    }

    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Entries</h3>

            <div className="space-y-3">
                {recentCycles.map((cycle) => {
                    const startDate = parseISO(cycle.startDate);
                    const endDate = parseISO(cycle.endDate);
                    const dayCount = differenceInDays(endDate, startDate) + 1;
                    const isExpanded = expandedId === cycle._id;

                    return (
                        <div
                            key={cycle._id}
                            className="border border-lavender-100 rounded-xl overflow-hidden transition-all hover:border-lavender-200"
                        >
                            {/* Entry Header */}
                            <button
                                onClick={() => toggleExpand(cycle._id)}
                                className="w-full p-3 flex items-start gap-3 hover:bg-lavender-50/50 transition-colors text-left"
                            >
                                <div className="p-2 bg-lavender-100 rounded-lg flex-shrink-0">
                                    <Calendar className="w-4 h-4 text-lavender-600" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-gray-800">
                                        {format(startDate, 'MMM dd, yyyy')} - {format(endDate, 'MMM dd, yyyy')}
                                        <span className="text-lavender-600 ml-1">({dayCount} days)</span>
                                    </div>
                                </div>

                                {isExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                )}
                            </button>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <div className="px-3 pb-3 pt-1 border-t border-lavender-50 bg-lavender-50/30 space-y-2">
                                    <div className="text-xs">
                                        <span className="font-medium text-gray-600">Symptoms:</span>
                                        <p className="text-gray-700 mt-1">
                                            {cycle.symptoms.length > 0 ? cycle.symptoms.join(', ') : 'None logged'}
                                        </p>
                                    </div>

                                    <div className="text-xs">
                                        <span className="font-medium text-gray-600">Flow:</span>
                                        <p className="text-gray-700 mt-1">{cycle.flowIntensity}</p>
                                    </div>

                                    <div className="text-xs">
                                        <span className="font-medium text-gray-600">Mood:</span>
                                        <p className="text-gray-700 mt-1">{cycle.mood || 'Not logged'}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecentEntries;
