class LocalStorageWatcher {
    constructor() {
        this.watchers = new Map();
        this.isListening = false;
        this.originalSetItem = null;
        this.originalRemoveItem = null;
        this.originalClear = null;
    }

    /**
     * Watch a specific localStorage key for changes
     * @param {string} key - The localStorage key to watch
     * @param {function} callback - Callback function called when key changes
     * @param {object} options - Options for the watcher
     * @param {boolean} options.immediate - Call callback immediately with current value
     * @param {boolean} options.deep - Also watch for changes from other tabs/windows
     */
    watch(key, callback, options = {}) {
        const { immediate = false, deep = true } = options;

        if (!this.watchers.has(key)) {
            this.watchers.set(key, []);
        }

        this.watchers.get(key).push(callback);

        // Start listening if this is the first watcher
        if (!this.isListening) {
            this.startListening();
        }

        // Call immediately with current value if requested
        if (immediate) {
            const currentValue = localStorage.getItem(key);
            callback(currentValue, null, key);
        }

        // Listen for storage events from other tabs if deep watching is enabled
        if (deep) {
            this.enableCrossTabWatching();
        }

        // Return unwatch function
        return () => this.unwatch(key, callback);
    }

    /**
     * Stop watching a specific key and callback
     * @param {string} key - The localStorage key
     * @param {function} callback - The callback to remove
     */
    unwatch(key, callback) {
        if (!this.watchers.has(key)) return;

        const callbacks = this.watchers.get(key);
        const index = callbacks.indexOf(callback);

        if (index > -1) {
            callbacks.splice(index, 1);
        }

        // Remove key if no more callbacks
        if (callbacks.length === 0) {
            this.watchers.delete(key);
        }

        // Stop listening if no more watchers
        if (this.watchers.size === 0) {
            this.stopListening();
        }
    }

    /**
     * Stop watching all keys
     */
    unwatchAll() {
        this.watchers.clear();
        this.stopListening();
    }

    /**
     * Start intercepting localStorage methods
     */
    startListening() {
        if (this.isListening) return;

        // Store original methods
        this.originalSetItem = Storage.prototype.setItem;
        this.originalRemoveItem = Storage.prototype.removeItem;
        this.originalClear = Storage.prototype.clear;

        const self = this;

        // Override setItem
        Storage.prototype.setItem = function (key, value) {
            const oldValue = this.getItem(key);
            const result = self.originalSetItem.call(this, key, value);

            if (self.watchers.has(key) && oldValue !== value) {
                self.notifyWatchers(key, value, oldValue);
            }

            return result;
        };

        // Override removeItem
        Storage.prototype.removeItem = function (key) {
            const oldValue = this.getItem(key);
            const result = self.originalRemoveItem.call(this, key);

            if (self.watchers.has(key) && oldValue !== null) {
                self.notifyWatchers(key, null, oldValue);
            }

            return result;
        };

        // Override clear
        Storage.prototype.clear = function () {
            const oldValues = {};

            // Store old values for watched keys
            for (const key of self.watchers.keys()) {
                oldValues[key] = this.getItem(key);
            }

            const result = self.originalClear.call(this);

            // Notify watchers for all cleared keys
            for (const [key, oldValue] of Object.entries(oldValues)) {
                if (oldValue !== null) {
                    self.notifyWatchers(key, null, oldValue);
                }
            }

            return result;
        };

        this.isListening = true;
    }

    /**
     * Restore original localStorage methods
     */
    stopListening() {
        if (!this.isListening) return;

        // Restore original methods
        if (this.originalSetItem) {
            Storage.prototype.setItem = this.originalSetItem;
        }
        if (this.originalRemoveItem) {
            Storage.prototype.removeItem = this.originalRemoveItem;
        }
        if (this.originalClear) {
            Storage.prototype.clear = this.originalClear;
        }

        this.isListening = false;

        // Remove storage event listener
        window.removeEventListener('storage', this.handleStorageEvent);
    }

    /**
     * Enable watching changes from other tabs/windows
     */
    enableCrossTabWatching() {
        if (!this.handleStorageEvent) {
            this.handleStorageEvent = (e) => {
                if (e.storageArea === localStorage && this.watchers.has(e.key)) {
                    this.notifyWatchers(e.key, e.newValue, e.oldValue);
                }
            };
        }

        window.addEventListener('storage', this.handleStorageEvent);
    }

    /**
     * Notify all watchers for a specific key
     * @param {string} key - The localStorage key
     * @param {string|null} newValue - New value
     * @param {string|null} oldValue - Old value
     */
    notifyWatchers(key, newValue, oldValue) {
        const callbacks = this.watchers.get(key);
        if (!callbacks) return;

        callbacks.forEach((callback) => {
            try {
                callback(newValue, oldValue, key);
            } catch (error) {
                console.error('Error in localStorage watcher callback:', error);
            }
        });
    }

    /**
     * Get current value of a watched key
     * @param {string} key - The localStorage key
     * @returns {string|null} Current value
     */
    getValue(key) {
        return localStorage.getItem(key);
    }

    /**
     * Check if a key is being watched
     * @param {string} key - The localStorage key
     * @returns {boolean} True if key is being watched
     */
    isWatching(key) {
        return this.watchers.has(key);
    }

    /**
     * Get all watched keys
     * @returns {string[]} Array of watched keys
     */
    getWatchedKeys() {
        return Array.from(this.watchers.keys());
    }
}

export default LocalStorageWatcher;
