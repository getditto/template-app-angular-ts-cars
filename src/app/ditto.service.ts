import { Injectable } from '@angular/core';
import { Ditto, LiveQuery, Subscription, Document, Logger, QueryObservationHandler, SingleObservationHandler, AttachmentToken, AttachmentFetcher} from '@dittolive/ditto'

@Injectable({
  providedIn: 'root'
})

export class DittoService {
  ditto: Ditto;

  observer: LiveQuery | undefined
  subscription: Subscription | undefined
  fetcher: AttachmentFetcher | undefined

  constructor() { 
    Logger.minimumLogLevel = 'Debug'
    this.ditto = new Ditto({ 
      type: 'onlinePlayground', 
      appID: 'YOUR_APP_ID', 
      token: 'YOUR_TOKEN'
    })
  }

  onInit() {
    this.ditto.startSync()
  }

  getItems(query: string, callback: QueryObservationHandler) {
    let collection = this.ditto.store.collection("cars")
    // This will stop subscriptions and evict existing documents and attachments to clear memory
    this.clearItems()

    // syncronize data in the background without blocking the main thread
    this.subscription = collection.find(query).subscribe()
    
    // get a callback when data changes
    this.observer = collection.find(query).observeLocal(callback);
  }

  getItem(id: string, callback: SingleObservationHandler) {
    let collection = this.ditto.store.collection("cars")
    this.clearItems()
    this.subscription = collection.findByID(id).subscribe()
    this.observer = collection.findByID(id).observeLocal(callback);
  }

  clearItems() {
    this.subscription?.cancel()
    this.observer?.stop()

    // You can speed up the app if you only evict when necessary, thus caching frequently accessed items 
    // This depends on your business logic, so for now we will just evict opportunistically.
    this.ditto.store.collection("cars").findAll().evict()
  }

  fetchAttachment(token: AttachmentToken) {
    // This will only fetch one attchment at a time, you can scale this by creating a Map of fetchers
    let promise = new Promise<Uint8Array>((resolve, reject) => {
      this.fetcher = this.ditto.store.collection("cars").fetchAttachment(token, (attachmentFetchEvent) => {
        switch (attachmentFetchEvent.type) {
          case 'Completed':
            const fetchedAttachment = attachmentFetchEvent.attachment
            // Do something with attachment
            let data = fetchedAttachment.getData()
            resolve(data)
            this.fetcher?.stop()
            break

          case 'Progress':
            console.log('loading...', Number(attachmentFetchEvent.downloadedBytes) / Number(attachmentFetchEvent.totalBytes))
            break
      
          default:
            reject(new Error('Unable to fetch attachment'))
            break
        }
      })
    })
    return promise
  }



}
