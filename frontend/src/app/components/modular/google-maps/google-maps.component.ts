import {Component, Input, OnInit} from '@angular/core';
import { Loader as MapsLoader } from "@googlemaps/js-api-loader"
import {FormControl} from '@angular/forms';
import {GOOGLE_MAPS_KEY, MAP_ID} from '../../../constants/keys';
import {BaseComponent} from '../../global/base/base-component';

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.scss']
})
export class GoogleMapsComponent extends BaseComponent implements OnInit {

  @Input() addressFormControl: FormControl;
  @Input() postCodeFormControl: FormControl;
  @Input() cityFormControl: FormControl;

  /** map object */
  map: google.maps.Map;
  /** marker object */
  marker: google.maps.Marker;
  /** position where map will be centered when displayed, currently Esbjerg */
  center = { lat: 55.4765, lng: 8.4594 };

  async ngOnInit() {
    await this.initMap();
    this.initAutocomplete();
  }

  async initMap() {
    const loader = new MapsLoader({
      apiKey: GOOGLE_MAPS_KEY,
      version: "weekly",
      libraries: ['places'],
      language: 'en' //TODO: change depending on current language
    });

    const { Map } = await loader.importLibrary("maps") as google.maps.MapsLibrary;
    this.map = new Map(document.getElementById("map") as HTMLElement, {
      center: this.center,
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      mapId: MAP_ID,
      zoom: 13
    });

    this.map.addListener('click', (event: any) => {
      this.placeMarker(event.latLng);
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        location: event.latLng
      }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK && results) {
          this.assignFormControls(results[0].address_components)
        }
      });
    })
  }

  initAutocomplete() {
    const input = document.getElementById("google-maps-input-field") as HTMLInputElement;
    const options = {
      componentRestrictions: { country: "dk" },
      fields: ["address_components", "geometry"],
      types: ["address"],
      strictBounds: false
    };

    const autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.setFields(["place_id", "geometry", "name"]);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      this.onPlaceSelected(place)
    })

    autocomplete.bindTo("bounds", this.map);
  }

  /** handles clicking on a map*/
  onPlaceSelected(place: google.maps.places.PlaceResult) {
    if (place?.geometry?.location) this.placeMarker(place.geometry.location);
    if (place?.address_components) this.assignFormControls(place.address_components);
  }

  /** draws a marker on the map in selected location */
  placeMarker(location: google.maps.LatLng) {
    if(location) {
      this.map.panTo(location);
      if (this.marker) this.marker.setMap(null);
      this.marker = new google.maps.Marker({
        position: location,
        map: this.map
      });
      this.map.setZoom(17);
    }
  }

  /** assigns the values into the form controls from the selected place */
  assignFormControls(addressComponents: google.maps.GeocoderAddressComponent[]) {
    console.log(addressComponents)
    const streetName = addressComponents.find(component => component.types.includes('route'))?.long_name ?? '';
    const streetNumber = addressComponents.find(component => component.types.includes('street_number'))?.long_name ?? '';
    const city = addressComponents.find(component => component.types.includes('locality'))?.long_name ?? '';
    const postCode = addressComponents.find(component => component.types.includes('postal_code'))?.long_name ?? '';

    this.addressFormControl.setValue(streetName + ' ' + streetNumber);
    this.postCodeFormControl.setValue(postCode);
    this.cityFormControl.setValue(city);
  }

  /** zooms in the map by 1 */
  zoomIn() {
    this.map.setZoom(this.map.getZoom()! + 1);
  }

  /** zooms out the map by 1 */
  zoomOut() {
    this.map.setZoom(this.map.getZoom()! - 1);
  }
}
