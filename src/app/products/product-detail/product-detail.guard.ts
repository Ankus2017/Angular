import {ActivatedRouteSnapshot, CanActivate, Router} from "@angular/router";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ProductDetailGuard implements CanActivate{

  constructor(private router: Router) {
  }
  canActivate(route: ActivatedRouteSnapshot) : boolean {

    const productId = Number(route.paramMap.get('id'))
      if(isNaN(productId) || productId < 1){
        //TODO navigate to error page
        this.router.navigate(['/products']);
        return false;
      }
    return true;
  }
}
