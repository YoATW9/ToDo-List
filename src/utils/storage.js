const STORAGE_KEYS = {
  TODOS: 'todos',
  LANGUAGE: 'language',
  CUSTOM_CATEGORIES: 'customCategories',
  SETTINGS: 'settings',
  THEME: 'theme',
};

class Storage {
  static set(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error(`Error saving to localStorage: ${error}`);
      return false;
    }
  }

  static get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage: ${error}`);
      return defaultValue;
    }
  }

  static remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage: ${error}`);
      return false;
    }
  }

  static clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error(`Error clearing localStorage: ${error}`);
      return false;
    }
  }

  // Specific methods for our app
  static getTodos() {
    return this.get(STORAGE_KEYS.TODOS, []);
  }

  static setTodos(todos) {
    return this.set(STORAGE_KEYS.TODOS, todos);
  }

  static getLanguage() {
    return this.get(STORAGE_KEYS.LANGUAGE, 'EN');
  }

  static setLanguage(language) {
    return this.set(STORAGE_KEYS.LANGUAGE, language);
  }

  static getCustomCategories() {
    return this.get(STORAGE_KEYS.CUSTOM_CATEGORIES, []);
  }

  static setCustomCategories(categories) {
    return this.set(STORAGE_KEYS.CUSTOM_CATEGORIES, categories);
  }

  static getSettings() {
    return this.get(STORAGE_KEYS.SETTINGS, {
      notifications: true,
      autoSort: true,
      showCompleted: true,
    });
  }

  static setSettings(settings) {
    return this.set(STORAGE_KEYS.SETTINGS, settings);
  }

  static getTheme() {
    return this.get(STORAGE_KEYS.THEME, 'light');
  }

  static setTheme(theme) {
    return this.set(STORAGE_KEYS.THEME, theme);
  }
}

export { Storage, STORAGE_KEYS };
