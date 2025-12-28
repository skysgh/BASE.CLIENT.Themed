import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ArchitectureQualityTypeDto } from '../models/dtos/architecture-quality-type.dto';

@Injectable({ providedIn: 'root' })
export class ArchitectureQualityTypeRepository {
  private readonly apiUrl = 'http://localhost:3000/app_architecture_QualityTypes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ArchitectureQualityTypeDto[]> {
    return this.http.get<ArchitectureQualityTypeDto[]>(this.apiUrl);
  }

  getById(id: string): Observable<ArchitectureQualityTypeDto> {
    return this.http.get<ArchitectureQualityTypeDto>(`${this.apiUrl}/${id}`);
  }

  create(dto: ArchitectureQualityTypeDto): Observable<ArchitectureQualityTypeDto> {
    return this.http.post<ArchitectureQualityTypeDto>(this.apiUrl, dto);
  }

  update(id: string, dto: ArchitectureQualityTypeDto): Observable<ArchitectureQualityTypeDto> {
    return this.http.put<ArchitectureQualityTypeDto>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
