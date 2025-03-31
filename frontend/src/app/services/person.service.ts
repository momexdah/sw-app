import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from '../models/person.model';
import { Starship } from '../models/starship.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) { }

  // Obtener todos los personajes
  getPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.apiUrl}/persons`);
  }

  // Obtener un personaje por ID
  getPersonById(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/persons/${id}`);
  }

  // Obtener naves de un personaje
  getPersonShips(id: number): Observable<Starship[]> {
    return this.http.get<Starship[]>(`${this.apiUrl}/persons/${id}/ships`);
  }

  // Eliminar un personaje (borrado lógico)
  deletePerson(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/persons/${id}`);
  }

  // Inicializar datos desde SWAPI
  initializeData(): Observable<any> {
    return this.http.post(`${this.apiUrl}/initialize`, {});
  }
}