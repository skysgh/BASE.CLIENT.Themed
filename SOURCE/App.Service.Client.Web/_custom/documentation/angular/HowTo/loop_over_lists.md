### Developer Directions


The following in general is insufficient
for the simple fact that the data usually
comes from an api call, therefore will be async
so looping over data that has not come back
won't deliver intended results:

```html
<ul class="navbar-nav" id="navbar-nav">
    @for(item of menuItems;track $index){
    <ng-container>...
```

The same issue with:

```html
  <tbody *ngIf="data">
    <tr *ngFor="let x of data">
      <td>{{x.title}}</td>
      <td>{{x.description}}</td>
      <td><a [routerLink]="['../view/', x.id]"><i class="ri-download-2-line"></i></a></td>
    </tr>
  </tbody>
```


better is as follows, as it waits for the late results to come in:

```html
<ng-container *ngIf="systemLanguages$ | async as languages">
  <ng-container *ngFor="let item of languages ; let i = index; trackBy: trackByCountryCode">
    ...
```

Note that there is a different outcome if you use `in` versus `of`.

If there is a chance what's come back from the server is more than you want to display
truncate it as below.
Reminder: slice takes a start index, and target index, where the target index is not included.
So [1,2,3,4,5].slice(1,4) = [2,3,4]

```html
<ng-container *ngFor="let faq of faqs.slice(0,5);let i=index">
```

If you don't want to use a ng-container, and want to repeat items directly, like LIs,
then you put it on the item you want repeated, not the wrapper. Like:

```html
<ul>
  <li *ngFor="let x of data">{{x.title}}</li>
</ul>
````
