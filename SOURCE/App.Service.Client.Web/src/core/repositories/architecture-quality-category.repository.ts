import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ArchitectureQualityCategoryDto } from '../models/dtos/architecture-quality-category.dto';

@Injectable({ providedIn: 'root' })
export class ArchitectureQualityCategoryRepository {
  private readonly apiUrl = 'http://localhost:3000/app_architecture_QualityCategories';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ArchitectureQualityCategoryDto[]> {
    return this.http.get<ArchitectureQualityCategoryDto[]>(this.apiUrl);
  }

  getByTypeId(typeId: string): Observable<ArchitectureQualityCategoryDto[]> {
    return this.http.get<ArchitectureQualityCategoryDto[]>(`${this.apiUrl}?typeFk=${typeId}`);
  }

  getById(id: string): Observable<ArchitectureQualityCategoryDto> {
    return this.http.get<ArchitectureQualityCategoryDto>(`${this.apiUrl}/${id}`);
  }

  create(dto: ArchitectureQualityCategoryDto): Observable<ArchitectureQualityCategoryDto> {
    return this.http.post<ArchitectureQualityCategoryDto>(this.apiUrl, dto);
  }

  update(id: string, dto: ArchitectureQualityCategoryDto): Observable<ArchitectureQualityCategoryDto> {
    return this.http.put<ArchitectureQualityCategoryDto>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
