import { useState } from 'react';
import { Tent, Search, MapPin } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { CampgroundCard } from '../components/CampgroundCard';
import { FilterBar } from '../components/FilterBar';
import { CampgroundDetail } from '../components/CampgroundDetail';
import type { Campground } from '../types';

export function CampgroundPage() {
  const { campgrounds, filters } = useAppStore();
  const [selectedCampground, setSelectedCampground] = useState<Campground | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCampgrounds = campgrounds.filter((campground) => {
    const matchesSearch = campground.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campground.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDistance = campground.distance !== undefined && campground.distance <= filters.distance;
    
    const matchesFacilities = filters.facilities.length === 0 ||
      filters.facilities.some(f => campground.facilities.includes(f));
    
    const matchesPetFriendly = !filters.petFriendly || campground.petFriendly;
    
    return matchesSearch && matchesDistance && matchesFacilities && matchesPetFriendly;
  });

  if (selectedCampground) {
    return <CampgroundDetail campground={selectedCampground} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-gradient-to-r from-primary to-green-500 text-white p-6">
        <div className="flex items-center gap-3 mb-4">
          <Tent className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold">露营发现</h1>
            <p className="text-white/70 text-sm">探索周边营地</p>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索营地名称或地址..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </header>

      <main className="p-4">
        <FilterBar />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-400" />
            <span className="text-gray-500 text-sm">共找到 {filteredCampgrounds.length} 个营地</span>
          </div>
        </div>

        {filteredCampgrounds.length > 0 ? (
          <div className="grid gap-4">
            {filteredCampgrounds.map((campground) => (
              <CampgroundCard
                key={campground.id}
                campground={campground}
                onClick={() => setSelectedCampground(campground)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Tent className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无符合条件的营地</p>
            <p className="text-gray-400 text-sm mt-1">试试调整筛选条件</p>
          </div>
        )}
      </main>
    </div>
  );
}
