/*
============================================
; Title:  nodebucket
; Author: Grayton Savickas
; Date:   18 Aug 2021
; Modified By:
; Description: This will prevent users from accessing the Homepage unless they sign in.\
;===========================================
*/

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private cookieService: CookieService){

  }

/**
 * Adds sessions via the Cookie service
 * @param route 
 * @param state 
 * @returns 
 */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const sessionUser = this.cookieService.get('session_user');

    /**
     * If there is a session user then the route can be activated
     */
    if (sessionUser)
    {
      return true; 
    }
    else // If not then re-route them to the sign-in page
    {
      this.router.navigate(['/session/signin']);
      return false;
    }


  }



  
}
