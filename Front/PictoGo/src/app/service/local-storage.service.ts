import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  savePseudo(pseudo: string) {
    localStorage.setItem('pseudo', pseudo);
  }

  disconnect() {
    localStorage.removeItem('pseudo');
  }

  getPseudo(): any {
    return localStorage.getItem('pseudo');
  }
}
