import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

import { ModalController } from '@ionic/angular';
import { ChatPage } from '../chat/chat.page';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private auth: AuthService, private router: Router, private modalCtrl: ModalController) {}

  ngOnInit(): void {}

  async openModal(division: string) {

    const modal = await this.modalCtrl.create({
      component: ChatPage,
      componentProps: { chat: division },
    });
    
    modal.present();
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
