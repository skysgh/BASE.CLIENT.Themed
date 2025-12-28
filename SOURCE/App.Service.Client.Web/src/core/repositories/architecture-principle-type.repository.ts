import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ArchitecturePrincipleTypeDto } from '../models/dtos/architecture-principle-type.dto';

@Injectable({ providedIn: 'root' })
export class ArchitecturePrincipleTypeRepository {
  private readonly apiUrl = 'http://localhost:3000/app_architecture_PrincipleTypes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ArchitecturePrincipleTypeDto[]> {
    return this.http.get<ArchitecturePrincipleTypeDto[]>(this.apiUrl);
  }

  getById(id: string): Observable<ArchitecturePrincipleTypeDto> {
    return this.http.get<ArchitecturePrincipleTypeDto>(`${this.apiUrl}/${id}`);
  }

  create(dto: ArchitecturePrincipleTypeDto): Observable<ArchitecturePrincipleTypeDto> {
    return this.http.post<ArchitecturePrincipleTypeDto>(this.apiUrl, dto);
  }

  update(id: string, dto: ArchitecturePrincipleTypeDto): Observable<ArchitecturePrincipleTypeDto> {
    return this.http.put<ArchitecturePrincipleTypeDto>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
