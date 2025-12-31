// Ag:
import { Component, OnInit } from "@angular/core";
// Services:
import { AccountService } from "../../../../../core/services/account.service";
import { cartData } from '../../../../../core/assets/data/fake/cart.data';

// Etc:
//
// Configuration:
import { appsConfiguration } from '../../../../../sites.app/configuration/implementations/apps.configuration';
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
    styleUrls: ['./component.scss'],
    standalone: false
})
export class BaseCoreCommonComponentTopBarShoppingComponent implements OnInit {
  public appsConfiguration = appsConfiguration
  public groupConfiguration = themesT1Configuration
  public viewModel: ViewModel = new ViewModel();

  // Feature flag - controls visibility (from applets.shopping.features.cart)
  public isEnabled: boolean = false;

  // Shopping
  public cartData!: CartModel[];
  total = 0;
  cart_length: any = 0;

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    private accountService: AccountService
  ) {
    // Check if shopping applet is enabled and cart feature is enabled
    this.accountService.getConfig().subscribe(config => {
      const shoppingApplet = config.applets?.['shopping'];
      if (shoppingApplet && typeof shoppingApplet === 'object') {
        this.isEnabled = shoppingApplet.enabled && (shoppingApplet.features?.['cart'] ?? true);
      } else {
        this.isEnabled = false;
      }
      this.defaultControllerServices.diagnosticsTraceService.debug(
        `${this.constructor.name} - Shopping cart enabled: ${this.isEnabled}`
      );
    });
  }

  ngOnInit(): void {
    if (this.isEnabled) {
      this.initCart();
    }
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

