import { Component } from '@angular/core'
import { RouterOutlet, RouterModule } from '@angular/router'

@Component({
    selector: 'app-root',
    standalone: true, // Set to true
    imports: [RouterModule, RouterOutlet], // Import necessary modules
    template: ` <router-outlet></router-outlet> `
})
export class AppComponent {}
