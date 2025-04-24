import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ITDcto {
  id:string;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})

export class TipodocumentoService {

  private readonly url = 'http://localhost:3000/tipodocumento/listaseleccion';

  constructor(private readonly http: HttpClient) { }

  getTiposdocumento(): Observable<ITDcto[]> {
    return this.http.get<ITDcto[]>(this.url);
  }
}

