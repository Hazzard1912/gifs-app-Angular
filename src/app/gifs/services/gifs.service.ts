import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse } from '../interface/gifs.interface';
import { Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private apiKey: string = process.env['API_KEY']!;
  private endPoint: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];
  public resultados: Gif[] = [];

  get historial(): string[] {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  }

  buscarGifs(busqueda: string): void {
    const item = busqueda.trim().toLowerCase();

    if (!this._historial.includes(item)) {
      this._historial.unshift(item);
      this._historial = this._historial.splice(0, 9);
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '12')
      .set('rating', 'r')
      .set('q', item);

    this.http
      .get<SearchGifsResponse>(`${this.endPoint}/search?`, { params })
      .subscribe((res) => {
        this.resultados = res.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      });
  }
}
