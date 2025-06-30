interface StorageData {
  projects: any[];
  settings: any;
  assets: any[];
  userPreferences: any;
}

class StorageService {
  private readonly STORAGE_KEY = 'gameai_studio_data';
  private readonly VERSION = '1.0.0';

  saveData(key: keyof StorageData, data: any): void {
    try {
      const existingData = this.loadAllData();
      existingData[key] = data;
      existingData.version = this.VERSION;
      existingData.lastUpdated = new Date().toISOString();
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingData));
    } catch (error) {
      console.error('Failed to save data:', error);
      throw new Error('Storage operation failed');
    }
  }

  loadData<T>(key: keyof StorageData): T | null {
    try {
      const data = this.loadAllData();
      return data[key] as T || null;
    } catch (error) {
      console.error('Failed to load data:', error);
      return null;
    }
  }

  private loadAllData(): StorageData & { version?: string; lastUpdated?: string } {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return this.getDefaultData();
      }
      
      const parsed = JSON.parse(stored);
      
      // Handle version migrations if needed
      if (parsed.version !== this.VERSION) {
        return this.migrateData(parsed);
      }
      
      return parsed;
    } catch (error) {
      console.error('Failed to parse stored data:', error);
      return this.getDefaultData();
    }
  }

  private getDefaultData(): StorageData {
    return {
      projects: [],
      settings: {
        theme: 'dark',
        language: 'en',
        notifications: {
          email: true,
          push: false,
          weekly: true
        },
        api: {
          novitaKey: '',
          geminiKey: ''
        }
      },
      assets: [],
      userPreferences: {
        sidebarOpen: true,
        defaultView: 'grid'
      }
    };
  }

  private migrateData(oldData: any): StorageData {
    // Handle data migration between versions
    const defaultData = this.getDefaultData();
    
    return {
      ...defaultData,
      ...oldData,
      version: this.VERSION
    };
  }

  clearAllData(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }

  exportData(): string {
    const data = this.loadAllData();
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  getStorageUsage(): { used: number; available: number; percentage: number } {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY) || '';
      const used = new Blob([data]).size;
      const available = 5 * 1024 * 1024; // 5MB typical localStorage limit
      
      return {
        used,
        available,
        percentage: (used / available) * 100
      };
    } catch (error) {
      return { used: 0, available: 0, percentage: 0 };
    }
  }
}

export const storageService = new StorageService();