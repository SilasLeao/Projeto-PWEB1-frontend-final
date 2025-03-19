// import { Injectable } from '@angular/core';
// import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { MessageService } from '../services/message.service';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class ErrorInterceptor implements HttpInterceptor {
//   constructor(private messageService: MessageService) {}
//
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     console.log("erro teste alowwwww")
//     return next.handle(req).pipe(
//       catchError((error: HttpErrorResponse) => this.proccessError(error))
//     );
//   }
//
//   proccessError(error: HttpErrorResponse): Observable<HttpEvent<any>> {
//     let errorMsg = 'Ocorreu um erro inesperado.';
//
//     if (error.status === 0) {
//       errorMsg = 'Erro de conexão. Verifique sua internet.';
//     } else if (error.status === 400) {
//       errorMsg = 'Requisição inválida.';
//     } else if (error.status === 401) {
//       errorMsg = 'Não autorizado! Faça login novamente.';
//     } else if (error.status === 404) {
//       errorMsg = 'Recurso não encontrado!';
//     } else if (error.status === 500) {
//       errorMsg = 'Erro no servidor. Tente novamente mais tarde.';
//     }
//
//     this.messageService.showMessage(errorMsg, 'error');
//     return throwError(error);
//   }
// }
//


import { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { MessageService } from '../services/message.service';

export const erroInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse): Observable<never> => {
      return processError(error, messageService);
    })
  );
};

function processError(error: HttpErrorResponse, messageService: MessageService): Observable<never> {
  let errorMsg = 'Ocorreu um erro inesperado.';

  if (error.status === 0) {
    errorMsg = 'Erro de conexão. Verifique sua internet.';
  } else if (error.status === 400) {
    errorMsg = 'Requisição inválida.';
  } else if (error.status === 401) {
    errorMsg = 'Não autorizado! Faça login novamente.';
  } else if (error.status === 404) {
    errorMsg = 'Recurso não encontrado!';
  } else if (error.status === 500) {
    errorMsg = 'Erro no servidor. Tente novamente mais tarde.';
  }

  messageService.showMessage(errorMsg, 'error');
  return throwError(() => error);
}


