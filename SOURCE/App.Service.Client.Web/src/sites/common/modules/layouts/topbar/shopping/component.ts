// Ag:
import { Component, OnInit } from "@angular/core";
// Etc:
import { TranslateService } from "@ngx-translate/core";
// Constants:
import { system as importedSystemConst } from '../../../../../../core/constants/system';
// Pipes:
import { BaseTranslatePipe } from '../../../../../../core.ui/pipes/basetranslate.pipe';
// Services:
import { SystemService } from '../../../../../../core/services/system.service';
// Models:
import { CartModel } from "../../models/topbar.model";

//Shit tmp data
import { cartData } from '../data';
import { ViewModel } from "../vm";


@Component({
  selector: 'app-base-common-components-topbar-languageshopping',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentTopBarShoppingComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  // Shopping
  cartData!: CartModel[];
  total = 0;
  cart_length: any = 0;

  constructor(
    systemService: SystemService,
    public translate: TranslateService) {

    // Make system/env variables avaiable to view template (via const or service):
    // this.system = systemService.system;
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
