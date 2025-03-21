import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';
import { User } from './user';
import { UserService } from './user.service';

export const loginGuardGuard: CanActivateFn = (route, state) => {

 
  // On inject le service pour regarder si l'utilisateur est connecté
  if (!inject(UserService).isLogged())
    // S'il n'est pas connecté on le redirige vers la page de login
    return createUrlTreeFromSnapshot(route, ["/login"]);
  // S'il est connecté, tout est beau on continue!
  else return true;
};
