/**
 * Social Domain Repositories
 * 
 * HTTP communication with Social API endpoints.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { socialConstants } from '../constants';
import { PersonDto, GroupDto, GroupMemberDto, GroupRoleDto } from '../models/dtos';

// ═══════════════════════════════════════════════════════════════════
// Person Repository
// ═══════════════════════════════════════════════════════════════════

@Injectable({ providedIn: 'root' })
export class PersonRepository {
  private readonly apiUrl = socialConstants.apis.people;

  constructor(private http: HttpClient) {}

  getAll(): Observable<PersonDto[]> {
    return this.http.get<PersonDto[]>(this.apiUrl);
  }

  getById(id: string): Observable<PersonDto> {
    return this.http.get<PersonDto>(`${this.apiUrl}/${id}`);
  }

  getByEmail(email: string): Observable<PersonDto[]> {
    return this.http.get<PersonDto[]>(`${this.apiUrl}?email=${encodeURIComponent(email)}`);
  }

  create(dto: PersonDto): Observable<PersonDto> {
    return this.http.post<PersonDto>(this.apiUrl, dto);
  }

  update(id: string, dto: PersonDto): Observable<PersonDto> {
    return this.http.put<PersonDto>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

// ═══════════════════════════════════════════════════════════════════
// Group Repository
// ═══════════════════════════════════════════════════════════════════

@Injectable({ providedIn: 'root' })
export class GroupRepository {
  private readonly apiUrl = socialConstants.apis.groups;

  constructor(private http: HttpClient) {}

  getAll(): Observable<GroupDto[]> {
    return this.http.get<GroupDto[]>(this.apiUrl);
  }

  getById(id: string): Observable<GroupDto> {
    return this.http.get<GroupDto>(`${this.apiUrl}/${id}`);
  }

  getByType(type: string): Observable<GroupDto[]> {
    return this.http.get<GroupDto[]>(`${this.apiUrl}?type=${type}`);
  }

  create(dto: GroupDto): Observable<GroupDto> {
    return this.http.post<GroupDto>(this.apiUrl, dto);
  }

  update(id: string, dto: GroupDto): Observable<GroupDto> {
    return this.http.put<GroupDto>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

// ═══════════════════════════════════════════════════════════════════
// Group Member Repository
// ═══════════════════════════════════════════════════════════════════

@Injectable({ providedIn: 'root' })
export class GroupMemberRepository {
  private readonly apiUrl = socialConstants.apis.groupMembers;

  constructor(private http: HttpClient) {}

  getAll(): Observable<GroupMemberDto[]> {
    return this.http.get<GroupMemberDto[]>(this.apiUrl);
  }

  getByGroupId(groupId: string): Observable<GroupMemberDto[]> {
    return this.http.get<GroupMemberDto[]>(`${this.apiUrl}?groupId=${groupId}`);
  }

  getByPersonId(personId: string): Observable<GroupMemberDto[]> {
    return this.http.get<GroupMemberDto[]>(`${this.apiUrl}?personId=${personId}`);
  }

  create(dto: GroupMemberDto): Observable<GroupMemberDto> {
    return this.http.post<GroupMemberDto>(this.apiUrl, dto);
  }

  update(id: string, dto: GroupMemberDto): Observable<GroupMemberDto> {
    return this.http.put<GroupMemberDto>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

// ═══════════════════════════════════════════════════════════════════
// Group Role Repository (Reference Data)
// ═══════════════════════════════════════════════════════════════════

@Injectable({ providedIn: 'root' })
export class GroupRoleRepository {
  private readonly apiUrl = socialConstants.apis.groupRoles;

  constructor(private http: HttpClient) {}

  getAll(): Observable<GroupRoleDto[]> {
    return this.http.get<GroupRoleDto[]>(this.apiUrl);
  }

  getById(id: string): Observable<GroupRoleDto> {
    return this.http.get<GroupRoleDto>(`${this.apiUrl}/${id}`);
  }
}
