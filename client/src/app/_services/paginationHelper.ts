import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { PaginatedResult } from "../_models/Pagination";

export function getPaginatedResult<T>(url: string, params: any, http: HttpClient) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    
    return http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body;

        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }

        return paginatedResult;
      })
    );
  }