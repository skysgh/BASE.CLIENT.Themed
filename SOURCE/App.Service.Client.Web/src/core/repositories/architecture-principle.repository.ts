import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ArchitecturePrincipleDto } from '../models/dtos/architecture-principle.dto';

@Injectable({ providedIn: 'root' })
export class ArchitecturePrincipleRepository {
  private readonly apiUrl = 'http://localhost:3000/app_architecture_Principles';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ArchitecturePrincipleDto[]> {
    return this.http.get<ArchitecturePrincipleDto[]>(this.apiUrl);
  }

  getByTypeId(typeId: string): Observable<ArchitecturePrincipleDto[]> {
    return this.http.get<ArchitecturePrincipleDto[]>(`${this.apiUrl}?typeFk=${typeId}`);
  }

  getById(id: string): Observable<ArchitecturePrincipleDto> {
    return this.http.get<ArchitecturePrincipleDto>(`${this.apiUrl}/${id}`);
  }

  create(dto: ArchitecturePrincipleDto): Observable<ArchitecturePrincipleDto> {
    return this.http.post<ArchitecturePrincipleDto>(this.apiUrl, dto);
  }

  update(id: string, dto: ArchitecturePrincipleDto): Observable<ArchitecturePrincipleDto> {
    return this.http.put<ArchitecturePrincipleDto>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
