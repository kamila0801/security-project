import {Injectable, signal} from "@angular/core";
import {StatusTypeNew} from "../../constants/request-status.enums";

@Injectable()
export class LoaderStore {

  loadingStatus = signal<StatusTypeNew>('DEFAULT')

  isProcessingQueue = signal<boolean>(false);

  async performActionWithStatusUpdate(action: () => Promise<void>, onSuccessRedirect?: () => Promise<boolean>) {
    try {
      this.loadingStatus.set('LOADING');
      // Perform the action and wait for it to complete.
      await action();
      this.loadingStatus.set('COMPLETED');
      // Call the onSuccess callback if provided
      if (onSuccessRedirect) {
        await onSuccessRedirect();
      }
    } catch (error) {
      this.loadingStatus.set('FAILED');
      console.error(error);
    }
  }
}
