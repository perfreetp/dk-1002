import { Tent, MapPin, CheckSquare, Cloud, Users } from 'lucide-react';

interface TabBarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const tabs = [
  { id: '/', label: '发现', icon: MapPin },
  { id: '/trip', label: '行程', icon: Tent },
  { id: '/checklist', label: '清单', icon: CheckSquare },
  { id: '/team', label: '协作', icon: Users },
  { id: '/weather', label: '天气', icon: Cloud },
];

export function TabBar({ currentPage, onNavigate }: TabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-40">
      <div className="max-w-md mx-auto flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentPage === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center py-2 px-4 transition-colors ${
                isActive ? 'text-primary' : 'text-gray-400'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
