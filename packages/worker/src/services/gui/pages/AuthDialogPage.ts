import { AbstractPage } from './AbstractPage';

export class AuthDialogPage extends AbstractPage {
  constructor(url: string, code: string) {
    super();

    this.addRow({ text: 'Authorization is required. Input the code on the GitHub page.' });
    this.addRow({ text: 'The code is copied into clipboard: ' }, { text: code, color: 'blueBright' });

    this.addSpacer();
    
    this.addRow({ text: 'In case browser does not open, please follow the link manually:' });
    this.addRow({ text: url, color: 'blueBright' })
    
    this.addSpacer();
    
    this.addRow({ text: 'Waiting for authorization...' });
  }
}
