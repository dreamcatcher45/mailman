import * as vscode from 'vscode';
import axios from 'axios';

export class MailTreeDataProvider implements vscode.TreeDataProvider<EmailItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<EmailItem | undefined | null | void> = new vscode.EventEmitter<EmailItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<EmailItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor() {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: EmailItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: EmailItem): Thenable<EmailItem[]> {
        if (element) {
            return Promise.resolve([]);
        } else {
            return this.getEmails();
        }
    }

    private async getEmails(): Promise<EmailItem[]> {
        try {
            const response = await axios.get('http://localhost:8025/api/v2/messages');
            const emails = response.data.items;
            return emails.map((email: any) => new EmailItem(email.Content.Headers.To[0], email));
        } catch (error) {
            vscode.window.showErrorMessage('Failed to fetch emails: ' + (error as Error).message);
            return [];
        }
    }
}

export class EmailItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly email: any
    ) {
        super(label, vscode.TreeItemCollapsibleState.None);

        this.tooltip = `From: ${email.Content.Headers.From[0]}`;
        this.description = new Date(email.Content.Headers.Date[0]).toLocaleString();
        this.command = {
            command: 'mailman.viewEmail',
            title: 'View Email',
            arguments: [this]
        };

        // Use the built-in mail icon
        this.iconPath = new vscode.ThemeIcon('mail');
    }
}
