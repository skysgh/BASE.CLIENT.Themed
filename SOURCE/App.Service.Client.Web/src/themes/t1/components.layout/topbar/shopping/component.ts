// Ag:
import { Component, OnInit } from "@angular/core";

import { cartData } from '../../../../../core/assets/data/fake/cart.data';

// Etc:
//
// Configuration:
import { appsConfiguration } from "../../../../../apps/configuration/implementations/apps.configuration";
import { themesT1Configuration } from "../../../configuration/implementations/themes.t1.configuration";
// Services:
import { DefaultComponentServices } from "../../../../../core/services/default-controller-services";
// Models:
import { CartModel } from "../../models/topbar.model";
import { ViewModel } from "../vm";
// Data:

@Component({
  selector: 'app-base-common-components-topbar-languageshopping',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentTopBarShoppingComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  
  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  // Shopping
  public cartData!: CartModel[];
  total = 0;
  cart_length: any = 0;

  constructor(
    private defaultControllerServices: DefaultComponentServices) {

    // Make system/env variables avaiable to view template (via const or service):

    //var x = this.appsConfiguration.others.applets.navigation.apps.education

    //var y = appsConfiguration.others.applets.navigation.education.products
  }

  ngOnInit(): void {
    this.initCart();
}

  private initCart() {
    this.cartData = cartData;

    this.cart_length = this.cartData.length;

    this.cartData.forEach((item) => {
      var item_price = item.quantity * item.price
      this.total += item_price
    });
  }

  // Delete Item
  deleteItem(event: any, id: any) {
    var price = event.target.closest('.dropdown-item').querySelector('.item_price').innerHTML;
    var Total_price = this.total - price;
    this.total = Total_price;
    this.cart_length = this.cart_length - 1;
    this.total > 1 ? (document.getElementById("empty-cart") as HTMLElement).style.display = "none" : (document.getElementById("empty-cart") as HTMLElement).style.display = "block";
    document.getElementById('item_' + id)?.remove();
  }

}

