import { useState } from 'react';
import { CheckSquare, Square, Package, Truck, UserPlus, X, Plus, Tent, Utensils, Pill, Shirt, MoreHorizontal } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { CHECKLIST_TEMPLATES } from '../types';

const CATEGORY_INFO = {
  tent: { name: '帐篷装备', icon: Tent, color: 'green' },
  cooking: { name: '炊具餐具', icon: Utensils, color: 'orange' },
  medicine: { name: '药品急救', icon: Pill, color: 'red' },
  clothing: { name: '衣物穿戴', icon: Shirt, color: 'blue' },
  other: { name: '其他物品', icon: MoreHorizontal, color: 'gray' },
};

export function ChecklistPage() {
  const { checklist, addChecklistItem, updateChecklistItem, deleteChecklistItem, teamMembers, currentTrip } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('tent');
  const [newItemName, setNewItemName] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const groupedItems = checklist.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof checklist>);

  const filteredCategories = filterCategory === 'all' 
    ? Object.keys(groupedItems) 
    : [filterCategory];

  const handleAddItems = () => {
    if (!currentTrip) return;
    
    const templateItems = CHECKLIST_TEMPLATES[selectedCategory as keyof typeof CHECKLIST_TEMPLATES] || [];
    templateItems.forEach(itemName => {
      const exists = checklist.some(item => item.name === itemName && item.category === selectedCategory);
      if (!exists) {
        addChecklistItem({
          tripId: currentTrip.id,
          name: itemName,
          category: selectedCategory,
          checked: false,
          assignedTo: '',
          loaded: false,
        });
      }
    });
    setShowAddModal(false);
  };

  const handleAddSingleItem = () => {
    if (!currentTrip || !newItemName.trim()) return;
    
    addChecklistItem({
      tripId: currentTrip.id,
      name: newItemName.trim(),
      category: selectedCategory,
      checked: false,
      assignedTo: '',
      loaded: false,
    });
    setNewItemName('');
  };

  const completedCount = checklist.filter(item => item.checked).length;
  const loadedCount = checklist.filter(item => item.loaded).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-gradient-to-r from-primary to-green-500 text-white p-6">
        <div className="flex items-center gap-3">
          <CheckSquare className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold">物品清单</h1>
            <p className="text-white/70 text-sm">{completedCount}/{checklist.length} 已完成 | {loadedCount} 已装车</p>
          </div>
        </div>
      </header>

      <main className="p-4">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterCategory === 'all'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 shadow-sm'
            }`}
          >
            全部
          </button>
          {Object.entries(CATEGORY_INFO).map(([key, info]) => {
            const Icon = info.icon;
            return (
              <button
                key={key}
                onClick={() => setFilterCategory(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                  filterCategory === key
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600 shadow-sm'
                }`}
              >
                <Icon className="w-4 h-4" />
                {info.name}
              </button>
            );
          })}
        </div>

        {filteredCategories.map(category => {
          const items = groupedItems[category] || [];
          const categoryInfo = CATEGORY_INFO[category as keyof typeof CATEGORY_INFO];
          const Icon = categoryInfo?.icon || MoreHorizontal;
          
          return (
            <div key={category} className="bg-white rounded-2xl shadow-md p-4 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${categoryInfo?.color}-100`}>
                  <Icon className={`w-5 h-5 text-${categoryInfo?.color}-600`} />
                </div>
                <span className="font-bold text-gray-800">{categoryInfo?.name}</span>
                <span className="text-sm text-gray-400">({items.filter(i => i.checked).length}/{items.length})</span>
              </div>

              <div className="space-y-2">
                {items.map(item => (
                  <div 
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      item.checked ? 'bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <button
                      onClick={() => updateChecklistItem(item.id, { checked: !item.checked })}
                      className="flex-shrink-0"
                    >
                      {item.checked ? (
                        <CheckSquare className="w-6 h-6 text-primary" />
                      ) : (
                        <Square className="w-6 h-6 text-gray-300" />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm ${item.checked ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {item.name}
                      </span>
                      {item.assignedTo && (
                        <span className="text-xs text-gray-400 ml-2">({item.assignedTo})</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateChecklistItem(item.id, { loaded: !item.loaded })}
                        className={`p-2 rounded-full transition-colors ${
                          item.loaded ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                        }`}
                        title={item.loaded ? '标记为未装车' : '标记为已装车'}
                      >
                        <Truck className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => setShowAssignModal(item.id)}
                        className="p-2 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors"
                        title="分配给队友"
                      >
                        <UserPlus className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => deleteChecklistItem(item.id)}
                        className="p-2 rounded-full bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500 transition-colors"
                        title="删除"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {checklist.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">清单还是空的</p>
            <p className="text-gray-400 text-sm mt-1">点击下方按钮添加物品</p>
          </div>
        )}

        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-24 right-4 w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center text-white hover:bg-green-600 transition-colors"
        >
          <Plus className="w-7 h-7" />
        </button>
      </main>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-slide-up">
            <h2 className="text-xl font-bold text-gray-800 mb-4">添加物品</h2>
            
            <div className="mb-4">
              <span className="text-sm text-gray-600 mb-2 block">选择分类</span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(CATEGORY_INFO).map(([key, info]) => {
                  const Icon = info.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${
                        selectedCategory === key
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {info.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="输入物品名称"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSingleItem()}
                />
                <button
                  onClick={handleAddSingleItem}
                  disabled={!newItemName.trim()}
                  className="px-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  添加
                </button>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-sm text-gray-600 mb-2 block">从模板添加</span>
              <p className="text-sm text-gray-400 mb-3">将添加以下物品到清单：</p>
              <div className="bg-gray-50 rounded-xl p-3 max-h-40 overflow-y-auto">
                {(CHECKLIST_TEMPLATES[selectedCategory as keyof typeof CHECKLIST_TEMPLATES] || []).map((item, index) => (
                  <div key={index} className="text-sm text-gray-600 py-1">{item}</div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddItems}
                className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-green-600 transition-colors"
              >
                添加模板物品
              </button>
            </div>
          </div>
        </div>
      )}

      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-slide-up">
            <h2 className="text-xl font-bold text-gray-800 mb-4">分配给队友</h2>
            
            <div className="space-y-2 mb-6">
              <button
                onClick={() => {
                  updateChecklistItem(showAssignModal, { assignedTo: '' });
                  setShowAssignModal(null);
                }}
                className={`w-full p-4 rounded-xl flex items-center gap-3 transition-colors ${
                  !checklist.find(i => i.id === showAssignModal)?.assignedTo
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="font-semibold">无</span>
                </div>
                <span className="font-medium">未分配</span>
              </button>
              
              {teamMembers.map(member => (
                <button
                  key={member.id}
                  onClick={() => {
                    updateChecklistItem(showAssignModal, { assignedTo: member.name });
                    setShowAssignModal(null);
                  }}
                  className={`w-full p-4 rounded-xl flex items-center gap-3 transition-colors ${
                    checklist.find(i => i.id === showAssignModal)?.assignedTo === member.name
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-medium">{member.name}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAssignModal(null)}
              className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
