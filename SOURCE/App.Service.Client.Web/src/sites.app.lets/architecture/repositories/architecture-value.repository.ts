import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ArchitectureValueDto } from '../models/dtos/architecture-value.dto';

@Injectable({ providedIn: 'root' })
export class ArchitectureValueRepository {
  private readonly apiUrl = 'http://localhost:3000/app_architecture_Values';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ArchitectureValueDto[]> {
    return this.http.get<ArchitectureValueDto[]>(this.apiUrl);
  }

  getById(id: string): Observable<ArchitectureValueDto> {
    return this.http.get<ArchitectureValueDto>(`${this.apiUrl}/${id}`);
  }

  create(dto: ArchitectureValueDto): Observable<ArchitectureValueDto> {
    return this.http.post<ArchitectureValueDto>(this.apiUrl, dto);
  }

  update(id: string, dto: ArchitectureValueDto): Observable<ArchitectureValueDto> {
    return this.http.put<ArchitectureValueDto>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
