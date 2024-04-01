// Ag:
import { Component, OnInit } from "@angular/core";
// Etc:
import { TranslateService } from "@ngx-translate/core";
// Constants:
import { system as importedSystemConst } from '../../../../constants/system';
// Services:
import { SystemService } from "../../../../services/system.service";
// Models:
import { CartModel } from "../../models/topbar.model";

//Shit tmp data
import { cartData } from '../data';


@Component({
  selector: 'app-base-common-components-topbar-languageshopping',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentTopBarShoppingComponent implements OnInit {
  // Make system/env variables avaiable to view template:
  system = importedSystemConst;

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
