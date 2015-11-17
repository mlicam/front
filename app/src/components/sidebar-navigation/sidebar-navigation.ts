import { Component, View, NgIf, NgFor, NgClass, EventEmitter } from 'angular2/angular2';
import { RouterLink } from 'angular2/router';
import { Navigation as NavigationService } from '../../services/navigation';
import { SessionFactory } from '../../services/session';

@Component({
  selector: 'minds-sidebar-navigation',
  viewBindings: [ NavigationService ]
})
@View({
  templateUrl: 'src/components/sidebar-navigation/sidebar-navigation.html',
  directives: [RouterLink, NgIf, NgFor, NgClass]
})

export class SidebarNavigation {
	user;
	session = SessionFactory.build();
	items;
	constructor(public navigation : NavigationService){
		var self = this;
    this.items = navigation.getItems('sidebar');
		this.getUser();

		//listen to click events to close nav
	}

	getUser(){
		var self = this;
		this.user = this.session.getLoggedInUser((user) => {
				self.user = user;
			});
	}
}
