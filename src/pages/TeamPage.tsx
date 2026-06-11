import { Users, CheckCircle2, Circle, Package, MapPin, Clock } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useNavigate } from 'react-router-dom';

export function TeamPage() {
  const { teamMembers, checklist, currentTrip } = useAppStore();
  const navigate = useNavigate();

  if (!currentTrip) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">暂无行程</h2>
          <p className="text-gray-500 mb-4">请先创建一个行程</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold"
          >
            去发现营地
          </button>
        </div>
      </div>
    );
  }

  const getMemberItems = (memberName: string) => {
    return checklist.filter(item => item.assignedTo === memberName);
  };

  const getMemberStats = (memberName: string) => {
    const items = getMemberItems(memberName);
    const completed = items.filter(item => item.checked).length;
    const loaded = items.filter(item => item.loaded).length;
    return { total: items.length, completed, loaded };
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-gradient-to-r from-primary to-green-500 text-white p-6">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold">同行协作</h1>
            <p className="text-white/70 text-sm">{currentTrip.name}</p>
          </div>
        </div>
      </header>

      <main className="p-4">
        <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">行程信息</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">{currentTrip.campgroundName}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">{currentTrip.startDate} - {currentTrip.endDate}</span>
            </div>
            {currentTrip.meetingPoint && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">集合点: {currentTrip.meetingPoint} {currentTrip.meetingTime}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
          <h2 className="font-bold text-gray-800 mb-4">队友列表</h2>
          
          <div className="space-y-4">
            {teamMembers.map((member) => {
              const stats = getMemberStats(member.name);
              const items = getMemberItems(member.name);
              
              return (
                <div key={member.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{member.name}</div>
                      <div className="text-sm text-gray-500">
                        {stats.completed}/{stats.total} 已完成 | {stats.loaded}/{stats.total} 已装车
                      </div>
                    </div>
                    {stats.total > 0 && stats.completed === stats.total && (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    )}
                  </div>

                  {items.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">负责物品</div>
                      {items.map((item) => (
                        <div 
                          key={item.id}
                          className={`flex items-center gap-2 p-2 rounded-lg ${
                            item.checked ? 'bg-green-50' : 'bg-white'
                          }`}
                        >
                          {item.checked ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                          )}
                          <span className={`text-sm flex-1 ${item.checked ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                            {item.name}
                          </span>
                          {item.loaded && (
                            <Package className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {items.length === 0 && (
                    <div className="text-sm text-gray-400 italic">暂无分配物品</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4">
          <h2 className="font-bold text-gray-800 mb-4">整体进度</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">完成进度</span>
                <span className="font-semibold text-primary">
                  {checklist.filter(item => item.checked).length}/{checklist.length}
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-green-400 transition-all duration-500"
                  style={{ width: checklist.length > 0 ? `${(checklist.filter(item => item.checked).length / checklist.length) * 100}%` : '0%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">装车进度</span>
                <span className="font-semibold text-blue-500">
                  {checklist.filter(item => item.loaded).length}/{checklist.length}
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                  style={{ width: checklist.length > 0 ? `${(checklist.filter(item => item.loaded).length / checklist.length) * 100}%` : '0%' }}
                />
              </div>
            </div>

            {checklist.filter(item => !item.assignedTo).length > 0 && (
              <div className="p-3 bg-yellow-50 rounded-xl flex items-center gap-2">
                <Package className="w-5 h-5 text-yellow-600" />
                <span className="text-yellow-700 text-sm">还有 {checklist.filter(item => !item.assignedTo).length} 件物品未分配</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
