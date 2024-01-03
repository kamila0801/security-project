import {Component, Input} from '@angular/core';
import {ValidationErrors} from '@angular/forms';
import {CommonModule} from "@angular/common";
import {IconComponent} from "../../../icon/icon.component";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'app-input-error-icon',
  standalone: true,
  imports: [CommonModule, IconComponent, MatTooltipModule],
  templateUrl: './input-error-icon.component.html'
})
export class InputErrorIconComponent {

  @Input() errors: ValidationErrors | null;

  getErrorMessage(): string {
    if (this.errors) {
      const firstKey = Object.keys(this.errors)[0];
      const error = this.errors[firstKey];

      return error.message;
    } else {
      return '';
    }
  }
}
