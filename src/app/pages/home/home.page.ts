import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components'

import { ModalController } from '@ionic/angular';
import { ChatPage } from '../chat/chat.page';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  public chatModal: any;

  constructor(private auth: AuthService, private router: Router,
    private modalCtrl: ModalController) { 
      this.modal = IonModal.prototype;
  }

  ngOnInit(): void {
    this.initializeChat();
  }

  async initializeChat() {
    await this.modalCtrl.create({
      component: ChatPage,
    }).then((result) => {
      console.log("Chat creado");
      this.chatModal = result;
    });
  }
  async openModal() {
    console.log(this.chatModal);
    this.chatModal.present()
    .then(()=> console.log("Presento..."))
    .catch((error : any) => console.log(error));

    const { data, role } = await this.chatModal.onWillDismiss();

    if (role === 'confirm') {
      this.message = `El mensaje es: ${data}!`;
    }
  }

  public textInput: string = '';
  public message: string = '';

  public isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  cerraSesion() {
    Swal.fire({
      heightAuto: false,
      title: '¿Cerrar Sesión?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#3085d6',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Cerrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.auth.logOut().then(() => this.router.navigateByUrl('/login'));
      }
    });
  }
}
