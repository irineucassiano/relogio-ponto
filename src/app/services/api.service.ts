import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  registrarUsuario(data: any) {
    return this.http.post(`${this.URL}/usuarios`, data);
  }

  login(data: any) {
    return this.http.post(`${this.URL}/login`, data);
  }

  registrarPonto(data: any) {
    return this.http.post(`${this.URL}/ponto`, data);
  }

  listarPontos(usuarioId: number) {
    return this.http.get(`${this.URL}/ponto/${usuarioId}`);
  }
}
