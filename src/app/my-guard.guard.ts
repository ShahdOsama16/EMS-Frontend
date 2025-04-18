import { CanActivateFn, Router } from '@angular/router';
import { ShareDataApiService } from './share-data-api.service';
import { inject } from '@angular/core';

export const myGuardGuard: CanActivateFn = (route, state) => {
  let sharedServices=inject(ShareDataApiService);
  let Router1=inject(Router);
  if(sharedServices.isLogin.getValue()==true){
    return true;
  }else{
    Router1.navigate(["/register"]);
    return false;
  }

};
