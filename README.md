# Window Resizer

A Firefox extension to quickly resize and reposition the browser window using custom presets.

## ✨ Features

- 🪟 Resize the browser to predefined dimensions  
- 🎯 Set custom position with `left` and `top` values  
- ➕ Add and edit presets directly from the options page  
- 📥 Import / 📤 Export your preset configurations  
- 🖱️ Drag and drop to reorder your presets  

## 🚀 How to Use

1. Click the extension icon in the Firefox toolbar.  
2. Select a preset to instantly apply its dimensions and position.  
3. Open **Options** to:  
   - Add/edit presets  
   - Import or export settings  
   - Use the current window size/position for a new preset  

## 🔧 Developer Setup

To run locally:

```bash
git clone https://github.com/sir-telengard/window-resizer.git
```

Then load it into Firefox:

1. Visit `about:debugging`
2. Click **"This Firefox"**
3. Click **"Load Temporary Add-on..."**
4. Select any file from the project folder (like `manifest.json`)

## 📂 File Structure

```
window-resizer/
├── css/
│   └── style.css
├── icons/
│   └── icon-16.png, icon-48.png, icon-128.png
├── js/
│   ├── popup.js
│   ├── options.js
│   ├── common.js
│   └── Sortable.min.js
├── popup.html
├── options.html
├── manifest.json
```

## 📄 License

This project is licensed under the MIT License.
