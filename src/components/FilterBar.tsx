import { useState } from 'react';
import { SlidersHorizontal, PawPrint, X } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { FACILITIES } from '../types';

export function FilterBar() {
  const { filters, setFilters } = useAppStore();
  const [showModal, setShowModal] = useState(false);

  const handleDistanceChange = (value: number) => {
    setFilters({ ...filters, distance: value });
  };

  const toggleFacility = (facility: string) => {
    const newFacilities = filters.facilities.includes(facility)
      ? filters.facilities.filter(f => f !== facility)
      : [...filters.facilities, facility];
    setFilters({ ...filters, facilities: newFacilities });
  };

  const togglePetFriendly = () => {
    setFilters({ ...filters, petFriendly: !filters.petFriendly });
  };

  const clearFilters = () => {
    setFilters({ distance: 100, facilities: [], petFriendly: false });
  };

  const hasActiveFilters = filters.distance < 100 || filters.facilities.length > 0 || filters.petFriendly;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
        <button
          className="w-full flex items-center justify-between"
          onClick={() => setShowModal(true)}
        >
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            <span className="font-semibold text-gray-800">筛选营地</span>
          </div>
          {hasActiveFilters && (
            <span className="bg-secondary text-white text-xs px-2 py-1 rounded-full">
              已筛选
            </span>
          )}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-3xl max-h-[80vh] overflow-y-auto animate-slide-up">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">筛选条件</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-700">距离范围</span>
                  <span className="text-primary font-bold">{filters.distance} km</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={filters.distance}
                  onChange={(e) => handleDistanceChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>5 km</span>
                  <span>100 km</span>
                </div>
              </div>

              <div className="mb-6">
                <span className="font-semibold text-gray-700 mb-3 block">设施偏好</span>
                <div className="flex flex-wrap gap-2">
                  {FACILITIES.map((facility) => (
                    <button
                      key={facility}
                      onClick={() => toggleFacility(facility)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        filters.facilities.includes(facility)
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {facility}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <button
                  onClick={togglePetFriendly}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    filters.petFriendly
                      ? 'border-primary bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <PawPrint className={`w-6 h-6 ${filters.petFriendly ? 'text-primary' : 'text-gray-400'}`} />
                    <span className={`font-semibold ${filters.petFriendly ? 'text-primary' : 'text-gray-700'}`}>
                      宠物友好
                    </span>
                  </div>
                  <div className={`w-10 h-6 rounded-full transition-all ${
                    filters.petFriendly ? 'bg-primary' : 'bg-gray-300'
                  }`}>
                    <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                      filters.petFriendly ? 'translate-x-4' : 'translate-x-0.5'
                    }`} />
                  </div>
                </button>
              </div>

              <div className="flex gap-3">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    清除筛选
                  </button>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-green-600 transition-colors"
                >
                  应用筛选
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
