# TryOn - AI Virtual Dressing Room

TryOn is a Chrome Extension and backend service that allows users to upload a person image once and try different clothes virtually by uploading garment images. The system uses gemini-2.5-flash-image-preview A.K.A Nano banana model to generate try-on previews.

## Features
- Upload person image once and store it locally.
- Upload different cloth images for try-on.
- AI model generates a preview of how the clothes look on the person.
- Works as a Chrome Extension with a simple UI.
- Backend server for handling image processing.

## Project Structure
```

├── tryon/
│   ├── index.js        # Express.js backend
│   ├── package.json    # Node dependencies
│   └── ...             # Other server files
|   tryon-extension/
│   ├── popup.html      # Chrome Extension UI
│   ├── style.css       # Styling for popup
│   ├── popup.js        # Frontend logic
│   └── manifest.json   # Chrome Extension config
└── README.md
```

## Prerequisites
- Node.js (v18 or above)
- npm
- Google Chrome (for extension usage)
- Postman (optional, for API testing)

## Setup Instructions

### Backend Setup
1. Clone this repository:
   ```bash
   git clone https://github.com/tryon.git
   cd tryon
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create an `.env` file in the server folder and add or directly add it in `index.js` file :
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. Run the server:
   ```bash
   node index.js
   ```
   The backend will start at `http://localhost:5000`.

### Chrome Extension Setup
1. Go to `chrome://extensions/` in Chrome.
2. Enable **Developer Mode** (top-right).
3. Click **Load unpacked** and select the `tryon-extension` folder.
4. The extension will appear in the toolbar. Pin it for easy access.

### Usage
1. Open the TryOn extension popup.
2. Upload your person image once (it will be saved in local storage).
3. Upload different cloth images to generate try-on results.
4. The result will be displayed inside the extension popup.

## Notes
- Person image is stored in browser localStorage for convenience.
- Generated results are fetched from the backend.
- Make sure your backend server is running before using the extension.
