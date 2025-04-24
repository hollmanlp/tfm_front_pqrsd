import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface ITramite {
  nombre: string;
  descripcion: string;
  dias: number;
}

@Injectable({
  providedIn: 'root',
})

export class TramiteService {
  private readonly url = 'http://localhost:3000/tramite/homepqrsd';

  constructor(private readonly http: HttpClient) {}

  getInfoTramites(): Observable<ITramite[]> {
    return this.http.get<ITramite[]>(this.url);
  }
}
