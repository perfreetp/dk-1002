export interface Campground {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  price: number;
  openTime: string;
  rating: number;
  facilities: string[];
  petFriendly: boolean;
  images: string[];
  distance?: number;
}

export interface Trip {
  id: string;
  name: string;
  campgroundId: string;
  campgroundName: string;
  startDate: string;
  endDate: string;
  budget: number;
  route: string;
  meetingPoint: string;
  meetingTime: string;
  backupPlan: string;
  createdAt: string;
}

export interface ChecklistItem {
  id: string;
  tripId: string;
  name: string;
  category: string;
  checked: boolean;
  assignedTo: string;
  loaded: boolean;
}

export interface WeatherData {
  temperature: number;
  high: number;
  low: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  rainChance: number;
  sunrise: string;
  sunset: string;
  uvIndex: number;
}

export interface FilterOptions {
  distance: number;
  facilities: string[];
  petFriendly: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
}

export const CHECKLIST_TEMPLATES: Record<string, string[]> = {
  tent: ['帐篷', '地垫', '睡袋', '防潮垫', '枕头', '天幕', '露营灯', '头灯'],
  cooking: ['炉具', '燃气罐', '锅具', '餐具', '水壶', '食材', '调味品', '洗碗布'],
  medicine: ['感冒药', '退烧药', '止痛药', '创可贴', '消毒用品', '抗过敏药', '晕车药', '急救包'],
  clothing: ['外套', '长裤', '短袖', '内衣', '袜子', '帽子', '手套', '雨具'],
  other: ['充电宝', '数据线', '手电筒', '刀具', '绳索', '垃圾袋', '洗漱用品', '防晒霜'],
};

export const FACILITIES = [
  '厕所', '淋浴', '水电', '烧烤区', '钓鱼台', '观景台', '停车场', '便利店'
];
