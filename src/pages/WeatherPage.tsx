import { Sun, Cloud, CloudRain, CloudSnow, Wind, Droplets, Thermometer, Sunrise, Sunset, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAppStore } from '../store/appStore';

const WEATHER_ICONS: Record<string, typeof Sun> = {
  '晴': Sun,
  '多云': Cloud,
  '阴': Cloud,
  '雨': CloudRain,
  '雪': CloudSnow,
};

const getWeatherIcon = (condition: string) => {
  for (const [key, Icon] of Object.entries(WEATHER_ICONS)) {
    if (condition.includes(key)) {
      return Icon;
    }
  }
  return Sun;
};

const getWindLevel = (speed: number) => {
  if (speed < 2) return { level: 0, desc: '无风' };
  if (speed < 4) return { level: 1, desc: '轻风' };
  if (speed < 6) return { level: 2, desc: '微风' };
  if (speed < 8) return { level: 3, desc: '和风' };
  if (speed < 10) return { level: 4, desc: '清风' };
  if (speed < 12) return { level: 5, desc: '强风' };
  return { level: 6, desc: '大风' };
};

const getUVLevel = (index: number) => {
  if (index < 3) return { level: '低', color: 'green' };
  if (index < 6) return { level: '中', color: 'yellow' };
  if (index < 8) return { level: '高', color: 'orange' };
  return { level: '极高', color: 'red' };
};

export function WeatherPage() {
  const { weather, isOffline } = useAppStore();

  if (!weather) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <Cloud className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">无法获取天气信息</p>
      </div>
    );
  }

  const WeatherIcon = getWeatherIcon(weather.condition);
  const windInfo = getWindLevel(weather.windSpeed);
  const uvInfo = getUVLevel(weather.uvIndex);
  const tempDiff = weather.high - weather.low;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-300 to-blue-200 pb-20">
      <header className="bg-white/20 backdrop-blur-sm text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">天气提醒</h1>
            <p className="text-white/70 text-sm">出发前准备</p>
          </div>
          <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-6xl font-bold text-gray-800 mb-1">{weather.temperature}°</div>
              <div className="text-gray-600">{weather.condition}</div>
            </div>
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <WeatherIcon className="w-12 h-12 text-blue-500" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Thermometer className="w-4 h-4" />
                <span>最高温度</span>
              </div>
              <span className="text-2xl font-bold text-red-500">{weather.high}°</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Thermometer className="w-4 h-4" />
                <span>最低温度</span>
              </div>
              <span className="text-2xl font-bold text-blue-500">{weather.low}°</span>
            </div>
          </div>

          {tempDiff >= 10 && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-700 text-sm">温差较大，建议携带外套</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
          <h2 className="font-bold text-gray-800 mb-4">详细信息</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Wind className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">风力</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-800">{weather.windSpeed} km/h</span>
                <span className="text-gray-400 text-sm ml-2">{windInfo.desc}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Droplets className="w-5 h-5 text-cyan-600" />
                <span className="text-gray-600">湿度</span>
              </div>
              <span className="font-semibold text-gray-800">{weather.humidity}%</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Droplets className="w-5 h-5 text-purple-600" />
                <span className="text-gray-600">降雨概率</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 transition-all"
                    style={{ width: `${weather.rainChance}%` }}
                  />
                </div>
                <span className="font-semibold text-gray-800">{weather.rainChance}%</span>
              </div>
            </div>

            {weather.rainChance > 50 && (
              <div className="p-3 bg-red-50 rounded-xl flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-red-600" />
                <span className="text-red-700 text-sm">降雨概率较高，记得携带雨具</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
          <h2 className="font-bold text-gray-800 mb-4">日出日落</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <Sunrise className="w-10 h-10 text-orange-500 mx-auto mb-2" />
              <div className="text-sm text-gray-500 mb-1">日出</div>
              <div className="text-xl font-bold text-gray-800">{weather.sunrise}</div>
            </div>
            <div className="bg-pink-50 rounded-xl p-4 text-center">
              <Sunset className="w-10 h-10 text-pink-500 mx-auto mb-2" />
              <div className="text-sm text-gray-500 mb-1">日落</div>
              <div className="text-xl font-bold text-gray-800">{weather.sunset}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4">
          <h2 className="font-bold text-gray-800 mb-4">紫外线指数</h2>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sun className={`w-8 h-8 text-${uvInfo.color}-500`} />
              <div>
                <div className="text-sm text-gray-500">紫外线强度</div>
                <div className={`font-bold text-${uvInfo.color}-600`}>{uvInfo.level}</div>
              </div>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div 
                  key={level}
                  className={`w-6 h-6 rounded-full ${
                    level <= Math.ceil(weather.uvIndex / 2)
                      ? `bg-${uvInfo.color}-500`
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {uvInfo.level === '高' || uvInfo.level === '极高' ? (
            <div className="mt-4 p-3 bg-orange-50 rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <span className="text-orange-700 text-sm">紫外线较强，注意防晒</span>
            </div>
          ) : null}
        </div>

        {isOffline && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800 text-sm">离线模式 - 天气数据可能不是最新的</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
