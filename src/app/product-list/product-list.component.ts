import { Component } from '@angular/core';
import { Product } from '../products';
import { DittoService } from '../ditto.service';
import { LiveQuery, Document, Subscription } from '@dittolive/ditto'
import { FormBuilder } from '@angular/forms';;


interface ViewableProduct {
  product: Product
  attachmentURL: string 
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  items: Product[] = [];
  currentItem: ViewableProduct | undefined
  checkoutForm = this.formBuilder.group({
    query: "color == 'gray'"
  });

  constructor(
    private dittoService: DittoService, 
    private formBuilder: FormBuilder) {}

  findById(id: string) {
    this.dittoService.getItem(id, (document: Document | null) => {
      if (document) {
        let product = new Product(document)
        this.fetchItem(product)
      } else {
      }
    })
  }

  fetchItem(item: Product) {
    if (item.attachmentToken) {
      let promise = this.dittoService.fetchAttachment(item.attachmentToken)
      promise.then(value => {
        this.currentItem = {
          product: item,
          attachmentURL: URL.createObjectURL(
            new Blob([value.buffer], { type: 'image/png' } /* (1) */)
          )
        }
      })

    }
  }

  getItems(query: string) {
    this.dittoService.getItems(query, (documents: Document[]) => {
      this.items = documents.map(doc => new Product(doc))
    })
  }

  clearItems() {
    this.dittoService.clearItems()
    this.items = [];
    this.currentItem = undefined;
    return this.items;
  }

  onSubmit(): void {
    // Process checkout data here
    this.getItems(this.checkoutForm.value.query|| "color == 'gray'");
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/