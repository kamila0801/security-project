import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import gsap from 'gsap';
import {RouterStore} from "mobx-angular";
import {StatusType} from "../../../../../constants/request-status.enums";
import {Router} from "@angular/router";
import {MorphSVGPlugin} from "gsap/MorphSVGPlugin";
import {reaction} from "mobx";
import {AnimationStatusStore} from "../../../../../stores/data-stores/animation-status.store";
import {SidebarItemInterface} from "../../interfaces/sidebar-item.interface";

// Register the plugin
gsap.registerPlugin(MorphSVGPlugin);

@Component({
  selector: 'app-sidebar-item',
  templateUrl: './sidebar-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarItemComponent implements AfterViewInit {

  @Input() link: any;
  @Input() iconName: string;
  @Input() text: string;
  // TODO NEED DESCRIPTION
  @Input() isIconInverted = false;
  @Input() subItems: SidebarItemInterface[];
  @Input() isColorModeToggle = false;
  @Input() solidColor = false;
  @Input() isSidebarOpen: boolean;
  @Input() itemId: string;
  @Output() onClickEmitter = new EventEmitter<any>();
  isListOpen = false;
  StatusType = StatusType;

  constructor(
    public routerStore: RouterStore,
    public animationStatusStore: AnimationStatusStore,
    public router: Router,
    public cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    reaction(
      () => this.animationStatusStore.getSidebarItemMoving,
      () => {
        this.cdr.detectChanges();
      }
    );
  }

  toggleList() {
    if (!this.subItems) { return; } // If the clicked item doesn't have any children
    if (this.animationStatusStore.getSidebarItem !== StatusType.COMPLETED) { return; } // Returns instantly if the animation is not completed

    if (this.isListOpen) {
      this.closeList();
    }
    else {
      this.openList();
    }
  }

  moveBlobDown() {
    gsap.to('.blob', {
      duration: 0.1,
      y: '+=113',
      ease: 'power2.inOut'
    });
  }

  moveBlobUp() {
    let svgWrapper = document.querySelector('#svgWrapper');
    let currentY = Number(gsap.getProperty(svgWrapper, 'y'));

    // Calculate the new position
    let newY = currentY - 113;

    // If newY is less than zero, set it to zero
    if (newY < 0) {
      newY = 0;
    }

    gsap.to('#svgWrapper', {
      duration: 0.1,
      y: newY,
      ease: 'power2.inOut'
    });
  }


  isItemHigherThanBlob() {
    const element = document.getElementById(this.itemId);
    const blobElement = document.getElementById('svgWrapper');

    // Define your threshold here.
    const threshold = 3;

    if (element && blobElement) {
      const elementTop = element.getBoundingClientRect().top;
      const blobElementTop = blobElement.getBoundingClientRect().top;

      // Determine if the element is higher than the blobElement
      const isElementHigher = elementTop < blobElementTop;

      // If the element is higher, check if the difference is within the threshold
      if (isElementHigher) {
        const distance = Math.abs(elementTop - blobElementTop); // Get the absolute distance between elements
        return distance > threshold; // Check if distance is within the threshold
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  openList() {
    if (this.animationStatusStore.getSidebarItem !== StatusType.COMPLETED) { return; } // Returns instantly if the animation is not completed
    if (this.isItemHigherThanBlob()) {
      this.moveBlobDown();
    }
    this.isListOpen = true;
  }

  closeList() {
    if (this.animationStatusStore.getSidebarItem !== StatusType.COMPLETED) { return; } // Returns instantly if the animation is not completed
    if (this.isItemHigherThanBlob()) {
      this.moveBlobUp();
    }
    this.isListOpen = false;
  }

  onItemClick(isItemFinal: boolean) {
    if (this.animationStatusStore.getSidebarItem !== StatusType.COMPLETED) { return; } // Returns instantly if the animation is not completed
    this.onClickEmitter.emit(isItemFinal);
    if (this.link) {
      this.router.navigate([this.link]);
    }
  }

  isUrlMatch() {
    return (this.link === this.routerStore.url || this.subItems?.some(subItem => subItem.link === this.routerStore.url))
  }
}
