import { Product } from '../../sites.app/education/models/product";

// use to pass this callback to a map method:
// eg:
// this.http.get<Product>()(url).pipe(map(data=>data.map(mapToProduct)));

function mapToProduct(item: any):Product{
  return {
    id: item.id,
    //productTypeFK: item.productTypeId,
    title: item.title,
    description:"...blah..."
    //cost: item.price
  }
}
