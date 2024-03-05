import { Product } from "../../apps/education/models/product";

// use to pass this callback to a map method:
// eg:
// this.http.get<Product>()(url).pipe(map(data=>data.map(mapToProduct)));

function mapToProduct(item: any):Product{
  return {
    id: item.id
    productTypeFk: item.productTypeId,
    title: item.title,
    cost: item.price
  }
}
