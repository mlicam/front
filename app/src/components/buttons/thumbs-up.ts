import { Component, ChangeDetectionStrategy } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';

import { SessionFactory } from '../../services/session';
import { Client } from '../../services/api';
import { WalletService } from '../../services/wallet';
import { SignupModalService } from '../modal/signup/service';


@Component({
  selector: 'minds-button-thumbs-up',
  viewBindings: [WalletService ],
  properties: ['_object: object'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="mdl-color-text--blue-grey-500" (click)="thumb()" [ngClass]="{'selected': has() }">
      <i class="material-icons">thumb_up</i>
      <counter *ngIf="object['thumbs:up:count'] > 0">{{object['thumbs:up:count']}}</counter>
    </a>
  `,
  directives: [CORE_DIRECTIVES]
})

export class ThumbsUpButton {

  object = {
    'guid': null,
    'owner_guid': null,
    'thumbs:up:user_guids': []
  };
  session = SessionFactory.build();
  showModal: boolean = false;
  guid: string = null;

  constructor(public client : Client, public wallet : WalletService, private modal : SignupModalService) {
  }

  set _object(value : any){
    if(!value)
      return;
    this.object = value;
    if(!this.object['thumbs:up:user_guids'])
      this.object['thumbs:up:user_guids'] = [];

    if (this.object['thumbs:guid']) {
      this.guid = this.object['thumbs:guid'];
    } else {
      this.guid = this.object.guid;
    }
  }

  thumb(){
    var self = this;

    if(!this.session.isLoggedIn()){
      this.modal.setSubtitle("You need to have a channel to vote").open();
      this.showModal = true;
      return false;
    }

    this.client.put('api/v1/thumbs/' + this.guid + '/up', {});
    if(!this.has()){
      //this.object['thumbs:up:user_guids'].push(this.session.getLoggedInUser().guid);
      this.object['thumbs:up:user_guids'] = [this.session.getLoggedInUser().guid];
      this.object['thumbs:up:count']++;
      if (this.session.getLoggedInUser().guid != this.object.owner_guid) {
        self.wallet.increment();
      }
    } else {
      for(let key in this.object['thumbs:up:user_guids']){
        if(this.object['thumbs:up:user_guids'][key] == this.session.getLoggedInUser().guid)
          delete this.object['thumbs:up:user_guids'][key];
      }
      this.object['thumbs:up:count']--;
      if (this.session.getLoggedInUser().guid != this.object.owner_guid) {
        self.wallet.decrement();
      }
    }
  }

  has(){
    for(var guid of this.object['thumbs:up:user_guids']){
      if(guid == this.session.getLoggedInUser().guid)
        return true;
    }
    return false;
  }

}
