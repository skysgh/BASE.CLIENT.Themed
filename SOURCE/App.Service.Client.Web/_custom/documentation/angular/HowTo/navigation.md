## Development Directions ##

Things to do next are:
* 2 and 3 level routing and back taking account of history and whether there is no history.
* system config
* Used to set flag to change from Json-Server to REST to odata based API backing repositoryService
* International key/value, accessing from angular (not sure it can, seeing it is a separate lib?)
* SystemSettingsService (Sponsor, etc.)
* User
* UserSettings
* Groups



Through [routerLink] directive
The navigate(Array) method of the Router class
The navigateByUrl(string) method which takes a string and returns a promise



Probable urls to consider are:

domain/apps/moe/persons
domain/apps/moe/persons/1

//unsure:
domain/apps/moe/persons/1/identities/2
domain/apps/moe/persons/1/identities/2

domain/apps/moe/identities
domain/apps/moe/identities/3

domain/apps/moe/places/1
domain/apps/moe/places/1/persons
domain/apps/moe/places/1/identities?type=students

domain/apps/moe/placeGroups/1
domain/apps/moe/placeGroups/1




domain/apps/moe/persons/1/invoices/3/lineitem/4?



Through [routerLink] directive
The navigate(Array) method of the Router class
The navigateByUrl(string) method which takes a string and returns a promise


Example: RouterLink:
<button type="button" class="btn btn-primary-outline pull-right" (click)="btnClick();"><i class="fa fa-plus"></i> Add</button>    


 [queryParams]="{mode:'red'}"
import { Router } from '@angular/router';

constructor(private router: Router) { }

btnClick= function () {
        this.router.navigateByUrl('/user');
		//equiv to:this.router.navigate(['/user']);
};


Alternatively:
put it on view, but 
IMPORTANT: 
if you put the link on a BUTTON (and not an A) it will NOT show in url preview, or be able right-click, open in another view.

You use routerLink, passing it an array of parts:

//relative:
 <button [routerLink]="['user', user.id, 'details']"> Button Label</button>
 <button [routerLink]="['../user', user.id, 'details']"> Button Label</button>
 

// Base:
 <button [routerLink]="['/user', user.id, 'details']"> Button Label</button>
 or also with params:
 <button [routerLink]="['/user', user.id, 'details']"  [queryParams]="{mode:'red'}"  queryParamsHandling="merge"> Button Label</button>
 You can do it dynamically also this way:
 <button [routerLink]="['/user', user.id, {details:true}]"  [queryParams]="{mode:'red'}"  queryParamsHandling="merge"> Button Label</button>
//generates: "user/123;details true" but not clear as when that would be useful.
 
 
 A crappy equiv is moving from array to simple {{}} notation:
 
 <a routerLink="/user/{{id}}/details"></a>


## Navigate:
// Inject Router into your component
// Inject ActivatedRoute into your component. This will allow the route to be done related to the current url
this._router.navigate(['user',user.id], {relativeTo: this._activatedRoute})
Another:
this.router.navigate(['/products', productId]);

## NavigateByUrl:

this._router.navigateByUrl(urlString).then((bool) => {}).catch()

And on the Target Controller:

constructor(private activatedRoute: ActivatedRoute) {

read queryParams:
this.activatedRoute.queryParams.subscribe(params => {
  console.log(params['type'])
  });  }
read params:
this.activatedRoute.params.subscribe(params => {
  console.log(params['type'])
  });  }
  
