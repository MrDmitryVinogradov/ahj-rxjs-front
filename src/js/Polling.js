/* eslint-disable class-methods-use-this */
import { interval } from 'rxjs';

import { ajax } from 'rxjs/ajax';

export default class Polling {
  constructor() {
    this.url = 'https://ahj-rxjs.herokuapp.com';
    this.time = new Date().getTime();
  }

  init() {
    this.renderBoard();
    this.getValues();
  }

  renderBoard() {
    this.messagesBoard = document.createElement('div');
    this.messagesBoard.classList.add('messages-board');
    document.querySelector('body').appendChild(this.messagesBoard);
  }

  getResponse() {
    // eslint-disable-next-line no-return-assign
    return ajax.getJSON(`${this.url}/messages/unread`);
  }

  getValues() {
    interval(1000).subscribe(() => {
      this.getResponse().subscribe(
        (data) => {
          data.messages.forEach((element) => {
            if (element.recieved > this.time) {
              this.addMessage(element);
              this.time = data.timestamp;
            }
          });
        },
      );
    });
  }

  addMessage(message) {
    const newMessage = `<div class = 'message'> <div class = 'from'> ${message.from} </div> <div class = 'subject'> ${message.subject.substr(0, 15)} </div> <div class = 'time'> ${new Date(message.recieved).toLocaleTimeString()} ${new Date(message.recieved).toLocaleDateString()}</div>`;
    this.messagesBoard.insertAdjacentHTML('afterbegin', newMessage);
  }
}
