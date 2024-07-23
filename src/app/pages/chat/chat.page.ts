import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy {
  @Input() chat: string = '';
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  public listMessages: Array<any> = [];
  public listUsers: Array<any> = [];
  public message: string = '';
  public loggedUser: any;

  private chatBD: string = '';
  private messagesSubs = Subscription.EMPTY;
  private userSubs = Subscription.EMPTY;

  constructor(private modalCtrl: ModalController, private auth: AuthService, 
    private database: DatabaseService, private firestore: AngularFirestore) { }

  ngOnInit() {
    this.loggedUser = this.auth.loggedUser;
    this.chatBD = this.chat == 'A' ? '4TOA' : '4TOB';
    
    const messagesObs = this.database.getCollectionSnapshot('chat-aulas')!.pipe(
      map((actions) => actions.map((a) => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return {id, ...data};
      })
    ));

    this.messagesSubs = messagesObs.subscribe((data: any) => {
      console.log(data);

      this.listMessages = data.find((aula: any) => aula.id === this.chatBD).mensajes;
      this.listMessages.forEach(unMensaje => {
        unMensaje.fecha = new Date(unMensaje.fecha.seconds * 1000);
      });
    });

    const usersObs = this.database.getCollectionSnapshot('usuarios')!.pipe(
      map((actions) => actions.map((a) => {
        const data = a.payload.doc.data() as any;
        const dbId = a.payload.doc.id;
        return {dbId, ...data};
      })
    ));

    this.userSubs = usersObs.subscribe((data: any) => {
      console.log(data);
      this.listUsers = data;
    });
  }

  ngOnDestroy(): void {
    this.messagesSubs.unsubscribe();
    this.userSubs.unsubscribe();
  }

  sendMessage() {
    this.message = this.message.trim();

    if(this.message != '') {
      const mensaje = { texto: this.message, fecha: new Date(), idEmisor: this.loggedUser.id };
      this.listMessages.push(mensaje);

      const doc = this.firestore.doc('chat-aulas/' + this.chatBD);
      doc.update({
        mensajes: this.listMessages
      })
      .then(() => this.scrollToBottom())
      .catch((err) => console.log(err));

      this.message = '';
    }
  }
  
  scrollToBottom() {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) { console.log(err); }
  }

  getName(id: number) {
    return this.listUsers.find(usuario => usuario.id === id).nombre;
  }

  goBack() {
    return this.modalCtrl.dismiss();
  }
}
