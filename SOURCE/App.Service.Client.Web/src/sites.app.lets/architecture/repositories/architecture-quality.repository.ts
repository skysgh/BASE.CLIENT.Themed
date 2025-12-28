import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ArchitectureQualityDto } from '../models/dtos/architecture-quality.dto';

@Injectable({ providedIn: 'root' })
export class ArchitectureQualityRepository {
  private readonly apiUrl = 'http://localhost:3000/app_architecture_Qualities';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ArchitectureQualityDto[]> {
    return this.http.get<ArchitectureQualityDto[]>(this.apiUrl);
  }

  getByCategoryId(categoryId: string): Observable<ArchitectureQualityDto[]> {
    return this.http.get<ArchitectureQualityDto[]>(`${this.apiUrl}?categoryFk=${categoryId}`);
  }

  getById(id: string): Observable<ArchitectureQualityDto> {
    return this.http.get<ArchitectureQualityDto>(`${this.apiUrl}/${id}`);
  }

  create(dto: ArchitectureQualityDto): Observable<ArchitectureQualityDto> {
    return this.http.post<ArchitectureQualityDto>(this.apiUrl, dto);
  }

  update(id: string, dto: ArchitectureQualityDto): Observable<ArchitectureQualityDto> {
    return this.http.put<ArchitectureQualityDto>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
