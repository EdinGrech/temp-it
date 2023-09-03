import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  imports: [IonicModule, CommonModule],
  standalone: true,
})
export class DateRangePickerComponent implements OnInit, OnChanges{
  @Input() minDate: string | undefined;
  @Input() maxDate: string | undefined;
  @Output() valueChange = new EventEmitter<{ start: string; end: string }>();

  startDate: string = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString();;
  endDate: string = new Date(new Date().setHours(new Date().getHours() + 2)).toISOString(); // Adjust for GMT+2

  constructor() {
    if(!this.maxDate) this.maxDate = new Date().toISOString();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['minDate'] && this.minDate){
      this.startDate = this.minDate;
    }
    if(changes['maxDate'] && this.maxDate){
      this.endDate = this.maxDate;
    }
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
