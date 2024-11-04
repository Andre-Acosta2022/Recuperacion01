import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Empleado } from '../models/empleado';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  private apiUrl="http://localhost:8080/api/empleado"
  constructor(private http: HttpClient) { }

  getEmpleado():Observable<Empleado[]>{
    return this.http.get<Empleado[]>(this.apiUrl);
  }
  getEmpleadoById(id:number):Observable<Empleado>{
    return this.http.get<Empleado>(`${this.apiUrl}/${id}`);
  }
  crearEmpleado(empleado: Empleado):Observable<Empleado>{
    return this.http.post<Empleado>(this.apiUrl,Empleado);
  }
  editarEmpleado(empleado: Empleado):Observable<Empleado>{
    return this.http.post<Empleado>(this.apiUrl,Empleado);
  }
  eliminarEmpleado(id:number){
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
