import {Component, effect, OnDestroy, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from "gsap";
import {BehaviorSubject} from "rxjs";
import {LoaderStore} from "../../../stores/data-stores/loader.store";
import {StatusType} from "../../../constants/request-status.enums";
import {getCurrentBreakpoint} from "../../util-common/break-point.util";

export type AnimationTask = {
  task: () => Promise<void>;
  instant: boolean;
}

@Component({
  selector: 'app-login-loading-animation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-loading-animation.component.html'
})
export class LoginLoadingAnimationComponent implements OnInit, OnDestroy {

  constructor(private loaderStore: LoaderStore) {
    let test: any;
    effect(() => {
      if (test === this.loaderStore.loadingStatus()) {
        return;
      }
      this.adjustWidth(this.loaderStore.loadingStatus());
      test = this.loaderStore.loadingStatus();
    }, {allowSignalWrites: true});
  }

  private _maxWidthAvailable = new BehaviorSubject<number>(0);
  maxWidthAvailable$ = this._maxWidthAvailable.asObservable();
  resizeListener: any;
  breakpointListener: any;

  private animationQueue: AnimationTask[] = [];


  ngOnInit() {
    this.resizeListener = this.handleResize.bind(this);
    window.addEventListener('resize', this.resizeListener);
    this.breakpointListener = this.checkBreakpointAndAdjust.bind(this);
    window.addEventListener('resize', this.breakpointListener);
    this.handleResize();  // Call once to set initial value
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeListener);
  }

  handleResize() {
    const element = document.getElementById('page-container');
    const width = element?.offsetWidth;

    if (width) {
      this._maxWidthAvailable.next(width);
    }
    console.log('Current width:', width);
  }

  checkBreakpointAndAdjust() {
    const currentStatus = this.loaderStore.loadingStatus();
    const currentBreakpoint = getCurrentBreakpoint();

    if (currentStatus === StatusType.FAILED || currentStatus === StatusType.READY) {
      if (['xs', 'sm', 'md'].includes(currentBreakpoint)) {
        this.adjustWidthForMobile();
      } else {
        this.adjustWidthForDesktop();
      }
    }
  }

  adjustWidthForDesktop() {
    const element = document.getElementById('login-loading-pane');
    gsap.to(element, {
      duration: 0.6,
      width: '50%',
      opacity: 1,
      ease: 'power2.out'
    });
  }

  adjustWidthForMobile() {
    const element = document.getElementById('login-loading-pane');
    gsap.to(element, {
      duration: 0.6,
      width: '0%',
      opacity: 1,
      ease: 'power2.out'
    });
  }

  adjustWidth(newStatus: any) {
    const element = document.getElementById('login-loading-pane');
    let targetWidth: string;
    let targetOpacity: number | undefined;
    let targetDuration: number | undefined;

    const currentBreakpoint = getCurrentBreakpoint();

    switch (newStatus) {
      case StatusType.DEFAULT:
        targetWidth = '100%';
        targetOpacity = 0;
        targetDuration = 0;
        break;
      case StatusType.LOADING:
        targetWidth = '100%';
        targetOpacity = 1;
        targetDuration = 0.6;
        break;
      case StatusType.COMPLETED:
        targetWidth = '100%';
        targetOpacity = 0;
        targetDuration = 0.6;
        break;
      case StatusType.READY:
      case StatusType.FAILED:
        if (['xs', 'sm', 'md'].includes(currentBreakpoint)) {
          targetWidth = '0%';
        } else {
          targetWidth = '50%';
        }
        targetOpacity = 1;
        targetDuration = 0.6;
        break;
      default:
        console.error('Unknown status:', newStatus);
        return;
    }

    const animationTask: AnimationTask = {
      task: () => {
        return new Promise<void>((resolve) => {
          gsap.to(element, {
            duration: targetDuration,
            width: targetWidth,
            opacity: targetOpacity,
            ease: 'power2.out',
            onComplete: resolve
          });
        });
      },
      instant: newStatus === StatusType.LOADING || newStatus === StatusType.DEFAULT
    };

    this.animationQueue.push(animationTask);
    this.processQueue();
  }

  async processQueue() {
    if (this.loaderStore.isProcessingQueue()) return;

    this.loaderStore.isProcessingQueue.set(true);

    while (this.animationQueue.length) {
      const { task, instant } = this.animationQueue.shift()!;
      await task();

      if (!instant && this.animationQueue.length) { // Check if there are more items in the queue
        await this.sleep(2000);
      }
    }

    this.loaderStore.isProcessingQueue.set(false);
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
