import { useState } from 'react';
import { format, differenceInDays } from 'date-fns';
import api from '../utils/api';
import type { Cycle } from '../types';
import { Trash2, Calendar } from 'lucide-react';

interface CycleListProps {
  cycles: Cycle[];
  onCycleDeleted: () => void;
}

const CycleList = ({ cycles, onCycleDeleted }: CycleListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cycle?')) return;

    setDeletingId(id);
    try {
      await api.delete(`/cycles/${id}`);
      onCycleDeleted();
    } catch (error) {
      console.error('Failed to delete cycle:', error);
      alert('Failed to delete cycle');
    } finally {
      setDeletingId(null);
    }
  };

  if (cycles.length === 0) {
    return (
      <div className="card text-center py-12">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">
          No periods logged yet. Start tracking to see your history!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Period history</h2>
          <p className="text-sm text-gray-600">Your logged cycles, symptoms, and mood.</p>
        </div>
        <div className="text-xs text-gray-500 shrink-0">{cycles.length} entries</div>
      </div>
      {cycles.map((cycle) => {
        const duration = differenceInDays(new Date(cycle.endDate), new Date(cycle.startDate)) + 1;
        return (
          <div key={cycle._id} className="card">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-lavender-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-lavender-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {format(new Date(cycle.startDate), 'MMM dd, yyyy')} -{' '}
                      {format(new Date(cycle.endDate), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-sm text-gray-500">{duration} days</p>
                  </div>
                </div>

                <div className="mt-2">
                  <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                    Flow: {cycle.flowIntensity}
                  </span>
                </div>

                {cycle.symptoms.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-600 mb-1">Symptoms:</p>
                    <div className="flex flex-wrap gap-2">
                      {cycle.symptoms.map((symptom, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-lavender-50 text-lavender-700 rounded-full text-xs"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-600 mb-1">Mood:</p>
                  <span className="px-2 py-1 bg-teal-50 text-teal-700 rounded-full text-xs">
                    {cycle.mood}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDelete(cycle._id)}
                disabled={deletingId === cycle._id}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                title="Delete cycle"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CycleList;

