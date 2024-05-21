import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-calendar',
  template: '<full-calendar #calendarRef class="full-calendar" [options]="calendarOptions"></full-calendar>',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendarRef') calendarComponent: FullCalendarComponent;
  calendarOptions: CalendarOptions;

  ngOnInit(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: ''
      },
      customButtons: {
        prev: {
          text: '&lt;', // Flecha izquierda
          click: () => {
            this.calendarComponent.getApi().prev();
          }
        },
        next: {
          text: '&gt;', // Flecha derecha
          click: () => {
            this.calendarComponent.getApi().next();
          }
        }
      },
      buttonText: {
        prev: '&lt;', // Flecha izquierda
        next: '&gt;'  // Flecha derecha
      }
    };
  }
}
