import * as vscode from 'vscode';
import { MailTreeDataProvider, EmailItem } from './mailTreeDataProvider';

export function activate(context: vscode.ExtensionContext) {
    const mailTreeDataProvider = new MailTreeDataProvider();
    vscode.window.registerTreeDataProvider('mailmanSidebar', mailTreeDataProvider);

    let disposable = vscode.commands.registerCommand('mailman.refreshEmails', () => {
        vscode.window.showInformationMessage('Refreshing emails...');
        mailTreeDataProvider.refresh();
    });
    context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('mailman.viewEmail', (emailItem: EmailItem) => {
		const panel = vscode.window.createWebviewPanel(
			'emailView',
			emailItem.email.Content.Headers.To[0],
			vscode.ViewColumn.One,
			{
				enableScripts: true
			}
		);
		panel.webview.html = getEmailWebviewContent(emailItem.email);
	});
	
    context.subscriptions.push(disposable);
}

function getEmailWebviewContent(email: any): string {
    const sanitizeHtml = (html: string) => {
        return html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/=20/g, ' ')
            .replace(/=\r\n/g, '')
            .replace(/=3D/g, '=');
    };

    const decodeQuotedPrintable = (text: string) => {
        return text.replace(/=([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16)));
    };

    let body = email.Content.Body;
    if (email.Content.Headers['Content-Transfer-Encoding'] && 
        email.Content.Headers['Content-Transfer-Encoding'][0].toLowerCase() === 'quoted-printable') {
        body = decodeQuotedPrintable(body);
    }

    body = body.startsWith('<html') ? sanitizeHtml(body) : `<pre>${body}</pre>`;

    const fromEmail = email.From.Mailbox + '@' + email.From.Domain;
    const dateTime = new Date(email.Content.Headers.Date[0]).toLocaleString();

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email View</title>
            <style>
                body {
                    font-family: sans-serif;
                    line-height: 0.5;
                    color: #555;
                    max-width: 100%;
                    margin: 0 auto;
                }
                .email-header {
                    border-bottom: 1px solid #030d22;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }
                .email-header p {
                    margin: 5px 0;
                }
                .email-body img {
                    max-width: 100%;
                    height: auto;
                }
                .email-body p {
                    margin: 0 0 10px 0;
                }
            </style>
        </head>
        <body>
            <div class="email-header">
                <p><strong>From:</strong> ${email.Content.Headers.From[0]} (${fromEmail})</p>
                <p><strong>Date:</strong> ${dateTime}</p>
                <p><strong>Subject:</strong> ${email.Content.Headers.Subject[0]}</p>
                <p><strong>To:</strong> ${email.Content.Headers.To[0]}</p>
            </div>
            <div class="email-body">
                ${body}
            </div>
        </body>
        </html>
    `;
}

export function deactivate() {}