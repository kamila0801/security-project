import { action, observable, computed } from 'mobx';

/**
 * Represents a store for managing infinite scrolling functionality.
 */
export class InfiniteScrollLoadingStore {

  /**
   * The threshold at which more items should be loaded.
   */
  threshold = 0;

  /**
   * The batch size for loading more items.
   */
  batchSize = 0;

  /**
   * The number of loaded items.
   */
  @observable loadedItemCount = 0;

  /**
   * The current threshold for loading more items.
   */
  @observable currentThreshold = 0;

  /**
   * Determines whether more items can be loaded.
   */
  @observable private _canLoadMore = true;

  /**
   * Creates an instance of InfiniteScrollLoadingStore.
   * @param {number} threshold - The threshold at which more items should be loaded.
   * @param {number} batchSize - The batch size for loading more items.
   */
  constructor(threshold: number, batchSize: number) {
    this.threshold = threshold;
    this.currentThreshold = threshold;
    this.batchSize = batchSize;
  }

  /**
   * Gets whether more items can be loaded.
   * @returns {boolean} True if more items can be loaded, otherwise false.
   */
  @computed get canLoadMore(): boolean {
    return this.loadedItemCount % this.currentThreshold === 0;
  }

  /**
   * Marks an item as loaded.
   */
  @action
  itemLoaded(): void {
    this.loadedItemCount++;
  }

  /**
   * Increments the current threshold for loading more items.
   */
  @action
  incrementCurrentThreshold(): void {
    this.currentThreshold += this.threshold;
  }

  /**
   * Resets the store values to their initial state.
   */
  @action
  resetValues(): void {
    this.currentThreshold = this.threshold;
    this.loadedItemCount = 0;
    this._canLoadMore = true;
  }
}
