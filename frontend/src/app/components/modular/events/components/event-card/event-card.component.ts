import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {EventModel} from 'src/app/interfaces/eventModel';
import {FileService} from 'src/app/services/file.service';
import {HttpClient} from "@angular/common/http";
import {Subject} from 'rxjs';
import {takeUntil} from "rxjs/operators";
import {InfiniteScrollLoadingStore} from "../../../../../stores/data-stores/events-infinite-scroll-loading.store";
import {BaseComponent} from "../../../../global/base/base-component";
import {InfoCardDetails, InfoCardType} from "./interfaces/card-info-type.interface";
import {IconNames} from "../../../../../constants/iconNames";

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventCardComponent extends BaseComponent implements OnDestroy, OnInit, OnChanges {

  @Output() imageLoaded = new EventEmitter<void>();  // Declare the event emitter

  @Input() event: EventModel;
  @Input() infLoadStore: InfiniteScrollLoadingStore;

  /**
   * This input determines if the card should be of the info type and also defines which kind of info it should show
   *
   * If defined, the card will be of info type therefor not having skeleton loader and neither content just the info
   * related to the type.
   * If not defined, the card will be of the normal type displaying the skeleton loader until loading is completed,
   * hereafter it will display its contents.
   */
  @Input() infoType: InfoCardType;

  @Output() infoCardClicked = new EventEmitter<InfoCardType>();

  public infoCardDetails: InfoCardDetails;

  private destroy$ = new Subject<void>();
  isLoadingLogo = true;
  imageSrc: string | null = null;
  constructor(
    public fileService: FileService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    if (this.event?.imageUrl) {
      this.fetchImage(this.fileService.getEventLogo(this.event.imageUrl));
    } else {
      this.isLoadingLogo = false;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.infoType) {
      this.determineInfoCardDetails()
    }
  }

  fetchImage(url: string) {
    this.http.get(url, { responseType: 'blob' })
      .pipe(takeUntil(this.destroy$))
      .subscribe(
      (blob) => {
        this.imageSrc = URL.createObjectURL(blob);
        this.isLoadingLogo = false;
        this.cdr.detectChanges();
        this.infLoadStore.itemLoaded();
        this.imageLoaded.emit();
      },
      (error) => {
        console.error('Failed to fetch the image:', error);
        this.isLoadingLogo = false;
        this.cdr.detectChanges();
      }
    );
  }

  private determineInfoCardDetails() {
    switch (this.infoType) {
      case InfoCardType.BOTTOM_REACHED: {
        this.infoCardDetails = {
          mainIcon: IconNames.sign_alt,
          title: 'Ups, you have reached the end',
          description: 'Didn\'t find what you were looking for? If you\'ve used multiple filters, consider adjusting them for better results',
          btnIcon: IconNames.arrow_circle_up,
          btnText: 'Back to top'
        }
        break;
      }
      case InfoCardType.NO_RESULTS_FOUND: {
        this.infoCardDetails = {
          mainIcon: IconNames.filter_slash,
          title: 'No records found',
          description: 'Didn\'t find what you were looking for? If you\'ve used multiple filters, consider adjusting them for better results',
          btnIcon: IconNames.redo,
          btnText: 'Reset filters'
        }
        break;
      }
    }
  }

  onInfoCardClick() {
    this.infoCardClicked.emit(this.infoType);
  }
}
