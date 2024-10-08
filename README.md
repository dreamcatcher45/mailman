# MailMan - VSCode Email Viewer Extension

**MailMan** is a Visual Studio Code extension that allows you to view emails from a MailHog server directly within the editor. It provides a tree view of your emails and allows you to view the full content of each email in a webview.

This extension is not affiliated with or endorsed by the official MailHog project. It is an independent tool designed to work with the MailHog server for email viewing.

## Features

- Fetch emails from a MailHog server.
- View email content with HTML formatting.
- Support for `quoted-printable` encoded emails.
- Easily refresh emails from the sidebar.
- Display basic email metadata such as sender, recipient, subject, and date.

## Installation

1. Install the extension from the Visual Studio Marketplace or manually from the `.vsix` file.
2. Ensure that [MailHog](https://github.com/mailhog/MailHog) is running locally on `http://localhost:8025`.
3. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS) and search for `MailMan`.
4. Use the available commands:
   - **MailMan: Refresh Emails** - Refreshes the list of emails from MailHog.
   - **MailMan: View Email** - Opens the selected email in a webview.

## Usage

- After installation, a new **MailMan** view will be available in the sidebar.
- Click the refresh button to load emails from the MailHog server.
- Click on an email to open and view its content.

  ![Demo](https://raw.githubusercontent.com/dreamcatcher45/mailman/refs/heads/main/media/demo.png)

## Requirements

- MailHog server running locally at `http://localhost:8025`.

## Extension Commands

| Command                    | Description                    |
|----------------------------|--------------------------------|
| `mailman.refreshEmails`     | Refreshes the email list       |
| `mailman.viewEmail`         | Opens an email in a webview    |

## Known Issues

- Email body formatting may vary depending on the content type of the email.
- Currently supports fetching emails only from a local MailHog instance.

## License

This extension is licensed under the [MIT License](LICENSE).
