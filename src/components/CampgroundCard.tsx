import { MapPin, Star, DollarSign, Clock, PawPrint } from 'lucide-react';
import type { Campground } from '../types';

interface CampgroundCardProps {
  campground: Campground;
  onClick: () => void;
}

export function CampgroundCard({ campground, onClick }: CampgroundCardProps) {
  return (
    <div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      onClick={onClick}
    >
      <div className="relative h-40 bg-gradient-to-br from-green-400 to-green-600">
        <img 
          src={campground.images[0]} 
          alt={campground.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-semibold text-gray-800">{campground.rating}</span>
        </div>
        {campground.petFriendly && (
          <div className="absolute top-3 left-3 bg-secondary/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
            <PawPrint className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">宠物友好</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{campground.name}</h3>
        
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{campground.address}</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-primary font-bold text-lg">{campground.price}</span>
            <span className="text-gray-400 text-sm">/晚</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>{campground.openTime}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {campground.facilities.slice(0, 3).map((facility) => (
            <span 
              key={facility}
              className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full"
            >
              {facility}
            </span>
          ))}
          {campground.facilities.length > 3 && (
            <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">
              +{campground.facilities.length - 3}
            </span>
          )}
        </div>
        
        {campground.distance && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">距离您</span>
            <span className="text-primary font-semibold">{campground.distance} km</span>
          </div>
        )}
      </div>
    </div>
  );
}
