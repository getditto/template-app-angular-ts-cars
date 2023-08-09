import { AttachmentToken, Document } from "@dittolive/ditto";
export class Product {
    id: string;
    numUpdates: number;
    color: string;
    attachmentToken: AttachmentToken | null

    constructor(doc: Document) {
      this.id = doc.at("_id").value
      this.numUpdates = doc.at("name").value
      this.color = doc.at("color").value
      this.attachmentToken = doc.at("att").attachmentToken
    }
  }
  
  
  /*
  Copyright Google LLC. All Rights Reserved.
  Use of this source code is governed by an MIT-style license that
  can be found in the LICENSE file at https://angular.io/license
  */