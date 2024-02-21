import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor() { }

  ngOnInit(): void {
    const nuevoPostButton = document.getElementById('nuevoPost') as HTMLButtonElement;
    const formularioPost = document.getElementById('formularioPost') as HTMLFormElement;

    formularioPost.style.display = 'none';

    nuevoPostButton.addEventListener('click', () => {
      formularioPost.style.display = 'block';
    });

    document.getElementById('publicar')?.addEventListener('click', () => {


    });
  }
}
