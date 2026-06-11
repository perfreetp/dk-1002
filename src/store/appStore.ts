import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Campground, Trip, ChecklistItem, WeatherData, FilterOptions, TeamMember } from '../types';
import { mockCampgrounds, mockTrip, mockChecklist, mockWeather, mockTeamMembers } from '../data/mockData';

interface AppState {
  campgrounds: Campground[];
  filters: FilterOptions;
  selectedCampground: Campground | null;
  
  trips: Trip[];
  currentTrip: Trip | null;
  
  checklist: ChecklistItem[];
  
  weather: WeatherData | null;
  
  teamMembers: TeamMember[];
  
  isOffline: boolean;
  loading: boolean;

  setFilters: (filters: FilterOptions) => void;
  selectCampground: (campground: Campground | null) => void;
  
  addTrip: (trip: Omit<Trip, 'id' | 'createdAt'>) => void;
  updateTrip: (trip: Trip) => void;
  setCurrentTrip: (trip: Trip | null) => void;
  
  addChecklistItem: (item: Omit<ChecklistItem, 'id'>) => void;
  updateChecklistItem: (id: string, updates: Partial<ChecklistItem>) => void;
  deleteChecklistItem: (id: string) => void;
  
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  
  loadData: () => void;
  checkOffline: () => void;
  shareTrip: () => string;
  getTripSummary: () => { completed: number; total: number; unchecked: ChecklistItem[]; unloaded: ChecklistItem[] };
  getTeamSummary: () => { arrived: number; total: number; unassignedItems: ChecklistItem[] };
}

const STORAGE_KEY = 'camp-app-storage';

const loadFromStorage = (): Partial<AppState> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    console.warn('Failed to load from storage');
  }
  return {};
};

const storedData = loadFromStorage();

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      campgrounds: storedData.campgrounds || mockCampgrounds,
      filters: storedData.filters || { distance: 100, facilities: [], petFriendly: false },
      selectedCampground: null,
      
      trips: storedData.trips || [mockTrip],
      currentTrip: storedData.currentTrip || mockTrip,
      
      checklist: storedData.checklist || mockChecklist,
      
      weather: mockWeather,
      
      teamMembers: mockTeamMembers,
      
      isOffline: !navigator.onLine,
      loading: false,

      setFilters: (filters) => set({ filters }),
      
      selectCampground: (campground) => set({ selectedCampground: campground }),
      
      addTrip: (tripData) => {
        const newTrip: Trip = {
          ...tripData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({ trips: [...state.trips, newTrip], currentTrip: newTrip }));
      },
      
      updateTrip: (updatedTrip) => {
        set((state) => ({
          trips: state.trips.map(t => t.id === updatedTrip.id ? updatedTrip : t),
          currentTrip: updatedTrip,
        }));
      },
      
      setCurrentTrip: (trip) => set({ currentTrip: trip }),
      
      addChecklistItem: (itemData) => {
        const newItem: ChecklistItem = {
          ...itemData,
          id: Date.now().toString(),
        };
        set((state) => ({ checklist: [...state.checklist, newItem] }));
      },
      
      updateChecklistItem: (id, updates) => {
        set((state) => ({
          checklist: state.checklist.map(item =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },
      
      deleteChecklistItem: (id) => {
        set((state) => ({ checklist: state.checklist.filter(item => item.id !== id) }));
      },
      
      updateTeamMember: (id, updates) => {
        set((state) => ({
          teamMembers: state.teamMembers.map(member =>
            member.id === id ? { ...member, ...updates } : member
          ),
        }));
      },
      
      loadData: () => {
        set({ loading: true });
        setTimeout(() => {
          set({ loading: false });
        }, 500);
      },
      
      checkOffline: () => {
        set({ isOffline: !navigator.onLine });
      },
      
      shareTrip: () => {
        const { currentTrip } = get();
        if (!currentTrip) return '';
        return `露营行程: ${currentTrip.name}\n地点: ${currentTrip.campgroundName}\n时间: ${currentTrip.startDate} - ${currentTrip.endDate}\n集合点: ${currentTrip.meetingPoint} ${currentTrip.meetingTime}`;
      },
      
      getTripSummary: () => {
        const { checklist } = get();
        const completed = checklist.filter(item => item.checked).length;
        const unchecked = checklist.filter(item => !item.checked);
        const unloaded = checklist.filter(item => !item.loaded);
        return { completed, total: checklist.length, unchecked, unloaded };
      },
      
      getTeamSummary: () => {
        const { teamMembers, checklist } = get();
        const arrived = teamMembers.filter(member => member.arrived).length;
        const unassignedItems = checklist.filter(item => !item.assignedTo);
        return { arrived, total: teamMembers.length, unassignedItems };
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        campgrounds: state.campgrounds,
        filters: state.filters,
        trips: state.trips,
        currentTrip: state.currentTrip,
        checklist: state.checklist,
        teamMembers: state.teamMembers,
      }),
    }
  )
);
