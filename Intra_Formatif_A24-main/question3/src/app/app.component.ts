import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';



@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [MatToolbarModule, MatIconModule, MatCardModule,MatError,MatInput,MatCard,MatLabel,
       ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule,MatInput,CommonModule]
})
export class AppComponent {
  title = 'reactive.form';

  form: FormGroup<any>;

  formData?: Data;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        name: ["", [Validators.required]],
        numero:['',[Validators.required,this.adresseValidator]],
        postalcode:['',[Validators.pattern("^[A-Z][0-9][A-Z][ ]?[0-9][A-Z][0-9]$")]],
        comment: ["", [this.tenWorldValidator]],
      },
      { validators:  this.nameValidation }
    );

    // À chaque fois que les valeurs changent, notre propriété formData sera mise à jour
    this.form.valueChanges.subscribe(() => {
      this.formData = this.form.value;
      
    });
  }

  nameValidation(control: AbstractControl): ValidationErrors | null {
    const name = control.get('name')?.value?.trim();
    const comment = control.get('comment')?.value.trim();
    if (!comment || !name) {
      return null;
    }
    
    let formValid= !comment.toLowerCase().includes(name);
  
    return !formValid ? { nameValidation: true } : null;

  }

  tenWorldValidator(control: AbstractControl): ValidationErrors | null {
    const comment = control.value;
    if (!comment) {
      return null;
    }
    let formValid;
    const wordCount = control.value.trim().split(/\s+/).length;
    if(wordCount >= 10)formValid = true;

    return !formValid ? { tenWorldValidator: true } : null;

  }


  adresseValidator(control: AbstractControl): ValidationErrors | null {
    const numero = control.value;
    if (!numero) {
      return null;
    }
    let formValid;
    if(numero >= 1000 && numero <=9999)formValid = true;

    return !formValid ? { adresseValidator: true } : null;

  }

  
}
// interface qui décris le type du formulaire
interface Data {
  name?: string | null;
  numero?: number|null;
  postalcode?:string|null;
  comment?:string|null;
 
}


