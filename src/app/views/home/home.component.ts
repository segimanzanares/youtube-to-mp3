import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    public form: UntypedFormGroup;

    constructor(
        private fb: UntypedFormBuilder,
    ) {
        this.form = this.fb.group({
            query: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        //
    }

    public searchVideos() {
        console.log("Search");
    }
}
