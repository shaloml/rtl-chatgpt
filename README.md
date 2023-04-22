# Right-to-Left Toggle Chrome Extension

This Chrome extension allows users to quickly toggle the direction of a web page from left-to-right (LTR) to right-to-left (RTL) and vice versa. By clicking the extension icon, the body text direction will change, and any elements with the `.overflow-y-auto` class will have their direction and display properties overridden. This is particularly useful for users who frequently work with RTL languages, such as Hebrew or Arabic, and want an easy way to switch the text direction for improved readability.

## Features

- Toggle web page text direction between LTR and RTL with a single click
- Automatically apply direction and display property changes to elements with the `.overflow-y-auto` class
- Lightweight and easy to use

## Installation

To install the extension from the Chrome Web Store, follow these steps:

1. Visit the Right-to-Left Toggle extension page on the Chrome Web Store.
2. Click the "Add to Chrome" button.
3. Confirm the installation by clicking "Add extension" in the pop-up window.

## Usage

After installing the extension, an icon will appear in your browser's toolbar. To toggle the text direction of the current web page, simply click the icon. The page will switch between LTR and RTL text directions, and the custom CSS rules will be applied or removed from elements with the `.overflow-y-auto` class.

## Permissions

The extension requires the following permissions:

- `activeTab`: Allows the extension to access and modify the content of the currently active tab when the user clicks the extension icon.
- `scripting`: Enables the extension to execute scripts on the active tab, which is necessary for toggling the text direction and applying or removing custom CSS rules.

## Support

If you have any questions or need assistance, please contact the extension's support team through [shaloml@gmail.com](mailto:shaloml@gmail.com).

## License

This extension is released under the [Apache License 2.0](LICENSE).
