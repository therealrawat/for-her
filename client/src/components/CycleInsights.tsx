import { MoreVertical } from 'lucide-react';
import type { Cycle } from '../types';

interface CycleInsightsProps {
    cycles: Cycle[];
}

const CycleInsights = ({ cycles }: CycleInsightsProps) => {
    // Get symptom frequency
    const getSymptomData = () => {
        const symptomMap = new Map<string, number>();

        cycles.forEach(cycle => {
            cycle.symptoms.forEach(symptom => {
                symptomMap.set(symptom, (symptomMap.get(symptom) || 0) + 1);
            });
        });

        return Array.from(symptomMap.entries())
            .map(([symptom, count]) => ({ symptom, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    };

    // Get mood frequency
    const getMoodData = () => {
        const moodMap = new Map<string, number>();

        cycles.forEach(cycle => {
            if (cycle.mood) {
                moodMap.set(cycle.mood, (moodMap.get(cycle.mood) || 0) + 1);
            }
        });

        return Array.from(moodMap.entries())
            .map(([mood, count]) => ({ mood, count }))
            .sort((a, b) => b.count - a.count);
    };

    const symptomData = getSymptomData();
    const moodData = getMoodData();
    const maxSymptomCount = Math.max(...symptomData.map(d => d.count), 1);
    const maxMoodCount = Math.max(...moodData.map(d => d.count), 1);

    // Simple line chart points for visual
    const generateLinePoints = (data: number[], width: number, height: number) => {
        if (data.length === 0) return '';

        const points = data.map((value, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - (value * height);
            return `${x},${y}`;
        }).join(' ');

        return points;
    };

    const symptomLineData = symptomData.map(d => d.count / maxSymptomCount);
    const moodLineData = moodData.map(d => d.count / maxMoodCount);

    if (cycles.length === 0) {
        return (
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Cycle Insights</h3>
                <p className="text-sm text-gray-500">Log more cycles to see insights and patterns.</p>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Cycle Insights</h3>
                    <p className="text-xs text-gray-500 mt-1">{cycles.length} entries</p>
                </div>
                <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
            </div>

            <div className="space-y-6">
                {/* Symptoms Chart */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-700">Symptoms</h4>
                        <span className="text-xs text-gray-500">Flow Consistency: Ineffective</span>
                    </div>

                    {/* Simple SVG Line Chart */}
                    {symptomData.length > 0 && (
                        <div className="mb-4">
                            <svg width="100%" height="60" className="mb-2">
                                <polyline
                                    points={generateLinePoints(symptomLineData, 300, 50)}
                                    fill="none"
                                    stroke="#7c3aed"
                                    strokeWidth="2"
                                    className="chart-line"
                                />
                                {symptomLineData.map((value, idx) => {
                                    const x = (idx / (symptomLineData.length - 1)) * 300;
                                    const y = 50 - (value * 50);
                                    return (
                                        <circle
                                            key={idx}
                                            cx={x}
                                            cy={y}
                                            r="3"
                                            fill="#7c3aed"
                                        />
                                    );
                                })}
                            </svg>
                        </div>
                    )}

                    {/* Symptom List */}
                    <div className="space-y-2">
                        {symptomData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">• {item.symptom}</span>
                                <span className="text-lavender-600 font-medium">{item.count}x</span>
                            </div>
                        ))}
                        {symptomData.length === 0 && (
                            <p className="text-xs text-gray-400">No symptoms logged yet</p>
                        )}
                    </div>
                </div>

                {/* Mood Insights Chart */}
                <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-700">Mood Insights</h4>
                        <span className="text-xs text-gray-500">Mood Swings: Fewer last month</span>
                    </div>

                    {/* Simple SVG Line Chart */}
                    {moodData.length > 0 && (
                        <div className="mb-4">
                            <svg width="100%" height="60" className="mb-2">
                                <polyline
                                    points={generateLinePoints(moodLineData, 300, 50)}
                                    fill="none"
                                    stroke="#0d9488"
                                    strokeWidth="2"
                                    className="chart-line"
                                />
                                {moodLineData.map((value, idx) => {
                                    const x = (idx / (moodLineData.length - 1)) * 300;
                                    const y = 50 - (value * 50);
                                    return (
                                        <circle
                                            key={idx}
                                            cx={x}
                                            cy={y}
                                            r="3"
                                            fill="#0d9488"
                                        />
                                    );
                                })}
                            </svg>
                        </div>
                    )}

                    {/* Mood List */}
                    <div className="space-y-2">
                        {moodData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">Mood: {item.mood}</span>
                                <span className="text-teal-600 font-medium">{item.count}x</span>
                            </div>
                        ))}
                        {moodData.length === 0 && (
                            <p className="text-xs text-gray-400">No moods logged yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CycleInsights;
