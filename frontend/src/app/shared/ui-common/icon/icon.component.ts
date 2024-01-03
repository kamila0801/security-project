import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
  @Input() icon: string | undefined;
}
