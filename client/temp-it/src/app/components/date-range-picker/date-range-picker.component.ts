import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  imports: [IonicModule, CommonModule],
  standalone: true,
})
export class DateRangePickerComponent implements OnInit{
  @Input() minDate: string | undefined;
  @Input() maxDate: string | undefined;
  @Output() valueChange = new EventEmitter<{ start: string; end: string }>();

  startDate: string = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString();;
  endDate: string = new Date().toISOString();

  constructor() {
    if(!this.maxDate) this.maxDate = new Date().toISOString();
  }

  ngOnInit(): void {
    this.valueChange.emit({ start: this.startDate, end: this.endDate });
  }

  dateRangeChanged(event: any, type: 'start' | 'end') {
    if (type === 'start') {
      this.startDate = event.detail.value;
    } else {
      this.endDate = event.detail.value;
    }
    if(this.startDate && this.endDate){
      this.valueChange.emit({ start: this.startDate, end: this.endDate });
    }
  }
}
