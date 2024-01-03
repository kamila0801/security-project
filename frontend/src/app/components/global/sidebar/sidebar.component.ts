import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  QueryList,
  ViewChildren
} from '@angular/core';
import {RouterStore} from 'mobx-angular';
import {ColorModeStore} from 'src/app/stores/data-stores/color-mode.store';
import {SidebarItemComponent} from "./components/sidebar-item/sidebar-item.component";
import {reaction} from "mobx";
import gsap from "gsap";
import {StatusType} from "../../../constants/request-status.enums";
import {MorphSVGPlugin} from "gsap/MorphSVGPlugin";
import {AnimationStatusStore} from "../../../stores/data-stores/animation-status.store";
import {NavigationUrls} from '../../../constants/Navigation/navigation-urls';
import {UserStore} from "../../../stores/api-stores/user.store";

gsap.registerPlugin(MorphSVGPlugin);

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements AfterViewInit {
  @ViewChildren(SidebarItemComponent) sidebarItems: QueryList<SidebarItemComponent>;
  navigationUrls = NavigationUrls;
  isSidebarOpen = false;

  constructor(
    public colorModeStore: ColorModeStore,
    public userStore: UserStore,
    public routerStore: RouterStore,
    private animationStatusStore: AnimationStatusStore,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    let oldUrl: string | null = null;
    reaction(
      () => this.routerStore.url,
      (url) => {
        const isListOfSubItemsOpen = this.sidebarItems.find(item => item.isListOpen)?.itemId;
        const oldItem = this.sidebarItems.find(item => item.link === oldUrl || item.subItems?.some(subItem => subItem.link === oldUrl));
        const item = this.sidebarItems.find(item => item.link === url || item.subItems?.some(subItem => subItem.link === url));
        if (item && !Object.is(item, oldItem)) {
          const itemId = item ? item.itemId : '';
          const itemIndex = this.sidebarItems.toArray().findIndex(itemComponent => itemComponent.itemId === itemId);
          setTimeout(() => { this.moveBlobToItem(itemId, isListOfSubItemsOpen, itemIndex); }, 100);
          if (this.isSidebarOpen) { this.closeSidebar(true) }
        } else {
          if (this.isSidebarOpen) { this.closeSidebar(false) }
          if (!item) { gsap.to('#sidebarItem', { fill: 'transparent', duration: 0.6 }); oldItem?.cdr.detectChanges(); }
        }
        oldUrl = url;
      }
    );
  }

  moveBlobToItem(itemId: string, isListOpen: any, index: number) {
    const element = document.getElementById(itemId) as HTMLElement;
    const elementBoundingBox = element.getBoundingClientRect(); // The current position and size of the menu item to move to.

    if (elementBoundingBox) {
      const tl = gsap.timeline({
        onStart: () => {
          this.animationStatusStore.setSidebarItem = StatusType.IN_PROGRESS;
        },
        onComplete: () => {
          this.animationStatusStore.setSidebarItem = StatusType.COMPLETED;
        }
      });

      let blobId = `#blob${Math.floor(Math.random() * 7) + 1}`; // Pick a random blob

      console.log(isListOpen);

      tl.to('#sidebarItem', {
        morphSVG: blobId, // use the generated id
        duration: 1,
        ease: 'sine',
      })
        .to("#svgWrapper", {
          duration: 0.3,
          left: elementBoundingBox?.left,
          y: 0,
          top: isListOpen ? (index * 52) + 118 : elementBoundingBox?.top,
          ease: 'sine',
          onStart: () => {
            this.animationStatusStore.setSidebarItemMoving = StatusType.IN_PROGRESS;
          },
          onComplete: () => {
            this.animationStatusStore.setSidebarItemMoving = StatusType.COMPLETED;
            gsap.to('#sidebarItem', { fill: '#5138EC', duration: 0.5, delay: 0.2 });
          }
        }, '-=1')  // Adjusted overlap with the morphing
        .to('#sidebarItem', {
          morphSVG: '#square',
          duration: 0.5,
          ease: 'sine',
        }, '-=0.3');
    } else {
      console.log('SVG square or elementBoundingBox is not found');
    }
  }

  toggleSidebar() {
    if (this.animationStatusStore.getSidebarItem !== StatusType.COMPLETED) { return; } // If the animation is not completed

    if (this.isSidebarOpen) {
      this.closeSidebar(false);
    } else {
      this.openSidebar();
    }
  }

  openSidebar() {
    this.expandBlob();
    this.isSidebarOpen = true;
  }

  closeSidebar(shouldCollapseInstant: boolean) {
    this.shrinkBlob(shouldCollapseInstant);
    this.closeAllLists();
    this.isSidebarOpen = false;
    this.cdr.detectChanges();
  }

  expandBlob() {
    gsap.to('#sidebarItem', {
      morphSVG: {shape: '#squareLong' },
      duration: 0.4,
      ease: 'power2.inOut',
    });
  }

  shrinkBlob(shouldCollapseInstant: boolean) {
    gsap.to('#sidebarItem', {
      morphSVG: '#square',
      duration: shouldCollapseInstant ? 0.1 : 0.4,
      ease: 'power2.inOut',
    });
  }

  handleItemClick(isItemFinal: boolean) {
    if (isItemFinal) {
      if (this.isSidebarOpen) {
      }
    } else {
      if (!this.isSidebarOpen) {
        this.openSidebar();
      }
    }
  }

  closeAllLists() {
    this.sidebarItems.forEach(item => item.closeList());
  }
}
