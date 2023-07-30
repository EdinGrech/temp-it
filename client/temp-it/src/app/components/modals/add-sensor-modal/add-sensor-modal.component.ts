import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-sensor-modal',
  templateUrl: './add-sensor-modal.component.html',
  styleUrls: ['./add-sensor-modal.component.scss'],
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  standalone: true
})

export class AddSensorModalComponent {
  wifiForm: FormGroup;
  constructor(private formBuilder:FormBuilder,private modalController: ModalController) {
    this.wifiForm = this.formBuilder.group({
      pin: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      wifiName: ['', [Validators.required]],
      wifiPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  submitForm(): void {
    if (this.wifiForm.valid) {
      // Send form data to backend
      console.log(this.wifiForm.value);
      this.modalController.dismiss(this.wifiForm.value);
    } else {
      // Handle form validation errors if needed
      console.log('Invalid form data');
    }
  }

  close() {
    this.modalController.dismiss();
  }
}
