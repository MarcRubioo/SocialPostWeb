import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-calendar',
  template: '<full-calendar class="full-calendar" [options]="calendarOptions"></full-calendar>',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions;

  ngOnInit(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin],
      initialView: 'dayGridMonth',
      locale: 'es',
      firstDay: 1,
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: ''
      }
    };
  }
}
