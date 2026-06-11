import { MapPin, Star, DollarSign, Clock, PawPrint, Phone, ChevronLeft, CalendarCheck } from 'lucide-react';
import type { Campground } from '../types';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';

interface CampgroundDetailProps {
  campground: Campground;
}

export function CampgroundDetail({ campground }: CampgroundDetailProps) {
  const navigate = useNavigate();
  const { addTrip } = useAppStore();

  const handleCreateTrip = () => {
    addTrip({
      name: `${campground.name}露营`,
      campgroundId: campground.id,
      campgroundName: campground.name,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      budget: 500,
      route: '',
      meetingPoint: '',
      meetingTime: '09:00',
      backupPlan: '',
    });
    navigate('/trip');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <img 
          src={campground.images[0]} 
          alt={campground.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="font-semibold">{campground.rating}</span>
            <span className="text-white/70">|</span>
            <span className="text-white/70">{campground.openTime}</span>
          </div>
          <h1 className="text-2xl font-bold">{campground.name}</h1>
        </div>
      </div>

      <div className="bg-white rounded-t-3xl -mt-6 relative z-10 p-6">
        <div className="flex items-center gap-2 text-gray-500 mb-4">
          <MapPin className="w-5 h-5" />
          <span>{campground.address}</span>
        </div>

        <p className="text-gray-600 mb-6 leading-relaxed">{campground.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-primary mb-1">
              <DollarSign className="w-5 h-5" />
              <span className="font-semibold">价格</span>
            </div>
            <span className="text-2xl font-bold text-primary">{campground.price}</span>
            <span className="text-gray-400 text-sm">/晚</span>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">营业时间</span>
            </div>
            <span className="text-lg font-semibold text-gray-800">{campground.openTime}</span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">设施服务</h3>
          <div className="flex flex-wrap gap-2">
            {campground.facilities.map((facility) => (
              <span 
                key={facility}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium"
              >
                {facility}
              </span>
            ))}
          </div>
        </div>

        {campground.petFriendly && (
          <div className="bg-orange-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <PawPrint className="w-6 h-6 text-secondary" />
              <div>
                <span className="font-semibold text-gray-800">宠物友好营地</span>
                <p className="text-sm text-gray-500">欢迎携带宠物入住</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">联系信息</h3>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">400-123-4567</span>
          </div>
        </div>

        <button 
          onClick={handleCreateTrip}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-green-500 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all"
        >
          <CalendarCheck className="w-5 h-5 inline-block mr-2" />
          创建行程
        </button>
      </div>
    </div>
  );
}
