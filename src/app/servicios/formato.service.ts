import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface IFormato {
  mime:string;
  extension: string;
}

@Injectable({
  providedIn: 'root'
})

export class FormatoService {

  private readonly url = 'http://localhost:3000/formato/pqrsd';

  constructor(private readonly http: HttpClient) { }
    getFormatosPqrsdAllowed(): Observable<IFormato[]> {
      return this.http.get<IFormato[]>(this.url);
    }
}
