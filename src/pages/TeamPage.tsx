import { Users, CheckCircle2, Circle, Package, MapPin, Clock, Phone, MessageCircle, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export function TeamPage() {
  const { teamMembers, checklist, currentTrip, updateTeamMember, getTeamSummary, navigateTo } = useAppStore();
  const teamSummary = getTeamSummary();

  if (!currentTrip) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">暂无行程</h2>
          <p className="text-gray-500 mb-4">请先创建一个行程</p>
          <button
            onClick={() => navigateTo('/')}
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

  const unassignedItems = checklist.filter(item => !item.assignedTo);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
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
            <button
              onClick={() => navigateTo('/trip')}
              className="flex items-center gap-1 text-primary text-sm font-medium"
            >
              编辑 <ChevronRight className="w-4 h-4" />
            </button>
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
          <h2 className="font-bold text-gray-800 mb-4">集合状态</h2>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600">到达人数</span>
            <span className="font-semibold text-primary">{teamSummary.arrived}/{teamSummary.total}</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
              style={{ width: teamSummary.total > 0 ? `${(teamSummary.arrived / teamSummary.total) * 100}%` : '0%' }}
            />
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
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">{member.name}</span>
                        <button
                          onClick={() => updateTeamMember(member.id, { arrived: !member.arrived })}
                          className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                            member.arrived 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {member.arrived ? '已到达' : '未到达'}
                        </button>
                      </div>
                      {member.notes && (
                        <div className="text-sm text-gray-500 mt-1">{member.notes}</div>
                      )}
                    </div>
                    {stats.total > 0 && stats.completed === stats.total && (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    )}
                  </div>

                  {member.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Phone className="w-4 h-4" />
                      <span>{member.phone}</span>
                      <button 
                        onClick={() => window.open(`tel:${member.phone}`, '_blank')}
                        className="ml-auto p-2 bg-blue-100 text-blue-600 rounded-full"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}

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

        {unassignedItems.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
            <h2 className="font-bold text-gray-800 mb-4">未分配物品</h2>
            
            <div className="space-y-2">
              {unassignedItems.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl"
                >
                  {item.checked ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <span className={`text-sm ${item.checked ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {item.name}
                    </span>
                    <span className="text-xs text-gray-400 ml-2 capitalize">
                      {item.category === 'tent' ? '帐篷' : item.category === 'cooking' ? '炊具' : item.category === 'medicine' ? '药品' : item.category === 'clothing' ? '衣物' : '其他'}
                    </span>
                  </div>
                  {item.loaded && (
                    <Package className="w-4 h-4 text-blue-500" />
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => navigateTo('/checklist')}
              className="w-full mt-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
            >
              去分配物品
            </button>
          </div>
        )}

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
          </div>
        </div>
      </main>
    </div>
  );
}
