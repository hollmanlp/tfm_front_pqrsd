import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface IPais {
  id:string;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})

export class PaisService {

  private readonly url = 'http://localhost:3000/pais/listaseleccion';

  constructor(private readonly http: HttpClient) { }

  getPaises(): Observable<IPais[]> {
    return this.http.get<IPais[]>(this.url);
  }
}
