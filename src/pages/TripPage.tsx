import { useState } from 'react';
import { Calendar, MapPin, Clock, Wallet, Route, AlertTriangle, Share2, CheckCircle2, Send } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import type { Trip } from '../types';

export function TripPage() {
  const { currentTrip, updateTrip, shareTrip, getTripSummary, isOffline } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [tripData, setTripData] = useState<Trip | null>(currentTrip);
  const [showSummary, setShowSummary] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareType, setShareType] = useState<'unchecked' | 'unloaded' | 'all'>('unchecked');

  if (!tripData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">暂无行程</h2>
          <p className="text-gray-500 mb-4">请先在营地发现页创建一个行程</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold"
          >
            去发现营地
          </button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (tripData) {
      updateTrip(tripData);
      setEditing(false);
    }
  };

  const handleShare = async () => {
    const text = shareTrip();
    if (navigator.share) {
      await navigator.share({
        title: tripData.name,
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('行程信息已复制到剪贴板');
    }
  };

  const summary = getTripSummary();
  const progress = summary.total > 0 ? (summary.completed / summary.total) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-gradient-to-r from-primary to-green-500 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">行程规划</h1>
            <p className="text-white/70 text-sm">{tripData.campgroundName}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              title="分享行程"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowSummary(true)}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              title="出发检查"
            >
              <CheckCircle2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="p-4">
        <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">{tripData.name}</h2>
            <button
              onClick={() => {
                setEditing(!editing);
                setTripData(currentTrip);
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                editing ? 'bg-gray-200 text-gray-700' : 'bg-primary text-white'
              }`}
            >
              {editing ? '取消' : '编辑'}
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">行程时间</div>
                {editing ? (
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={tripData.startDate}
                      onChange={(e) => setTripData({ ...tripData, startDate: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <span className="text-gray-400 self-center">-</span>
                    <input
                      type="date"
                      value={tripData.endDate}
                      onChange={(e) => setTripData({ ...tripData, endDate: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                ) : (
                  <div className="font-semibold text-gray-800">{tripData.startDate} - {tripData.endDate}</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">集合地点</div>
                {editing ? (
                  <input
                    type="text"
                    value={tripData.meetingPoint}
                    onChange={(e) => setTripData({ ...tripData, meetingPoint: e.target.value })}
                    placeholder="输入集合地点"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                ) : (
                  <div className="font-semibold text-gray-800">{tripData.meetingPoint || '未设置'}</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">集合时间</div>
                {editing ? (
                  <input
                    type="time"
                    value={tripData.meetingTime}
                    onChange={(e) => setTripData({ ...tripData, meetingTime: e.target.value })}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                ) : (
                  <div className="font-semibold text-gray-800">{tripData.meetingTime}</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">预算</div>
                {editing ? (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">¥</span>
                    <input
                      type="number"
                      value={tripData.budget}
                      onChange={(e) => setTripData({ ...tripData, budget: Number(e.target.value) })}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                ) : (
                  <div className="font-semibold text-gray-800">¥{tripData.budget}</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Route className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">路线</div>
                {editing ? (
                  <textarea
                    value={tripData.route}
                    onChange={(e) => setTripData({ ...tripData, route: e.target.value })}
                    placeholder="输入路线信息"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                ) : (
                  <div className="font-semibold text-gray-800">{tripData.route || '未设置'}</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">备用方案</div>
                {editing ? (
                  <textarea
                    value={tripData.backupPlan}
                    onChange={(e) => setTripData({ ...tripData, backupPlan: e.target.value })}
                    placeholder="输入备用方案"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                ) : (
                  <div className="font-semibold text-gray-800">{tripData.backupPlan || '未设置'}</div>
                )}
              </div>
            </div>
          </div>

          {editing && (
            <button
              onClick={handleSave}
              className="w-full mt-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
            >
              保存修改
            </button>
          )}
        </div>

        {isOffline && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800 text-sm">离线模式 - 数据已本地保存</span>
            </div>
          </div>
        )}
      </main>

      {showSummary && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-slide-up max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">出发前检查</h2>
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-secondary text-white rounded-full text-sm font-medium hover:bg-orange-600 transition-colors"
              >
                <Send className="w-4 h-4" />
                分享待办
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">准备进度</span>
                <span className="font-semibold text-primary">{summary.completed}/{summary.total}</span>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-green-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {summary.unchecked.length > 0 ? (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">未完成事项</h3>
                <div className="space-y-2">
                  {summary.unchecked.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                      <div className="flex-1">
                        <span className="text-gray-800">{item.name}</span>
                        {item.assignedTo && (
                          <span className="text-gray-400 text-sm ml-2">({item.assignedTo})</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 capitalize">{item.category === 'tent' ? '帐篷' : item.category === 'cooking' ? '炊具' : item.category === 'medicine' ? '药品' : item.category === 'clothing' ? '衣物' : '其他'}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-6 bg-green-50 rounded-xl p-4 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-green-700 font-semibold">所有准备工作已完成！</p>
              </div>
            )}

            <button
              onClick={() => setShowSummary(false)}
              className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-slide-up">
            <h2 className="text-xl font-bold text-gray-800 mb-4">分享待办</h2>
            
            <div className="mb-6">
              <span className="text-sm text-gray-600 mb-2 block">选择分享内容</span>
              <div className="space-y-2">
                <button
                  onClick={() => setShareType('unchecked')}
                  className={`w-full p-3 rounded-xl border-2 transition-colors ${
                    shareType === 'unchecked'
                      ? 'border-primary bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">未完成事项</span>
                    <span className="text-sm text-gray-500">{summary.unchecked.length} 项</span>
                  </div>
                </button>
                <button
                  onClick={() => setShareType('unloaded')}
                  className={`w-full p-3 rounded-xl border-2 transition-colors ${
                    shareType === 'unloaded'
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">未装车物品</span>
                    <span className="text-sm text-gray-500">{summary.unloaded?.length || 0} 项</span>
                  </div>
                </button>
                <button
                  onClick={() => setShareType('all')}
                  className={`w-full p-3 rounded-xl border-2 transition-colors ${
                    shareType === 'all'
                      ? 'border-primary bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">全部提醒</span>
                    <span className="text-sm text-gray-500">{summary.total} 项</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  let items = [];
                  let title = '';
                  
                  if (shareType === 'unchecked') {
                    items = summary.unchecked;
                    title = '未完成事项';
                  } else if (shareType === 'unloaded') {
                    items = summary.unchecked?.filter(item => !item.loaded) || [];
                    title = '未装车物品';
                  } else {
                    items = summary.unchecked;
                    title = '全部提醒';
                  }
                  
                  const itemsText = items.map(item => {
                    const assignee = item.assignedTo ? ` (${item.assignedTo})` : '';
                    return `- ${item.name}${assignee}`;
                  }).join('\n');
                  
                  const shareText = `【${title}】\n${currentTrip?.name || '露营行程'}\n\n集合点: ${currentTrip?.meetingPoint || '未设置'} ${currentTrip?.meetingTime || ''}\n\n${title}:\n${itemsText}\n\n请尽快完成准备工作！`;
                  
                  navigator.clipboard.writeText(shareText);
                  alert('待办清单已复制到剪贴板');
                  setShowShareModal(false);
                }}
                className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-green-600 transition-colors"
              >
                复制链接
              </button>
              <button
                onClick={() => {
                  let items = [];
                  let title = '';
                  
                  if (shareType === 'unchecked') {
                    items = summary.unchecked;
                    title = '未完成事项';
                  } else if (shareType === 'unloaded') {
                    items = summary.unchecked?.filter(item => !item.loaded) || [];
                    title = '未装车物品';
                  } else {
                    items = summary.unchecked;
                    title = '全部提醒';
                  }
                  
                  const itemsText = items.map(item => {
                    const assignee = item.assignedTo ? ` (${item.assignedTo})` : '';
                    return `- ${item.name}${assignee}`;
                  }).join('\n');
                  
                  const shareText = `【${title}】\n${currentTrip?.name || '露营行程'}\n\n集合点: ${currentTrip?.meetingPoint || '未设置'} ${currentTrip?.meetingTime || ''}\n\n${title}:\n${itemsText}\n\n请尽快完成准备工作！`;
                  
                  if (navigator.share) {
                    navigator.share({
                      title: title,
                      text: shareText,
                    }).then(() => setShowShareModal(false));
                  } else {
                    navigator.clipboard.writeText(shareText);
                    alert('待办清单已复制到剪贴板');
                    setShowShareModal(false);
                  }
                }}
                className="flex-1 py-3 rounded-xl bg-secondary text-white font-semibold hover:bg-orange-600 transition-colors"
              >
                系统分享
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
