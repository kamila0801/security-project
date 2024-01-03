import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {SocialLoginButtonTypes} from "./social-login-button.types";

@Component({
  selector: 'app-social-login-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './social-login-button.component.html'
})
export class SocialLoginButtonComponent {
  @Input() socialType: SocialLoginButtonTypes;
  @Output() onClick = new EventEmitter();
}
