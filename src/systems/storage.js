// Local Storage Manager for persistence

const STORAGE_KEY = 'tempu_stand_save_v1';

const defaultData = {
  highScoreCollector: 0,
  highScoreDriver: 0,
  totalSessions: 0,
  lastRole: null,
  collectorStats: {
    totalExtorted: 0,
    leaderGiven: 0,
    warningsCount: 0,
    timesTransferred: 0
  },
  driverStats: {
    tripsCompleted: 0,
    extortionEvaded: 0,
    vegetablesDeliveredKg: 0
  }
};

class StorageController {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return { ...defaultData, ...JSON.parse(raw) };
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
    return { ...defaultData };
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Could not write to localStorage', e);
    }
  }

  recordCollectorSession({ netEarnings, leader10, penalties, warnings }) {
    this.data.totalSessions++;
    this.data.lastRole = 'collector';
    if (netEarnings > this.data.highScoreCollector) {
      this.data.highScoreCollector = netEarnings;
    }
    this.data.collectorStats.totalExtorted += (netEarnings + leader10);
    this.data.collectorStats.leaderGiven += leader10;
    this.data.collectorStats.warningsCount += warnings;
    this.save();
  }

  recordDriverSession({ profit, totalBribePaid, deliveredKg }) {
    this.data.totalSessions++;
    this.data.lastRole = 'driver';
    if (profit > this.data.highScoreDriver) {
      this.data.highScoreDriver = profit;
    }
    this.data.driverStats.tripsCompleted++;
    this.data.driverStats.vegetablesDeliveredKg += deliveredKg;
    this.save();
  }
}

export const storage = new StorageController();
