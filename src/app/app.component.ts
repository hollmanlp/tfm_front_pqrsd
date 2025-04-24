import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule, RouterOutlet } from '@angular/router';
import { TramiteService } from './servicios/tramite.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

interface ITramite {
  nombre: string;
  descripcion: string;
  dias: number
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  
  tramites: ITramite[] = [];
  title = 'Portal de Tr&aacute;mites';
  mostrarContenido = true;
  
  constructor(private readonly tramiteService: TramiteService, private readonly router: Router) { 

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Solo mostrar contenido en la ruta raíz
        this.mostrarContenido = event.urlAfterRedirects === '/';
      });

  }

  ngOnInit(): void {
    this.tramiteService.getInfoTramites().subscribe((data: ITramite[]) => {
      this.tramites = data;
    });
  }
}