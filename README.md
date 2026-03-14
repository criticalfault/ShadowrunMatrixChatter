# Comment Formatter

A Vite/React app for building, formatting, and exporting timestamped comment threads. Inspired by a Python script that generates formatted chat logs with usernames and timestamps — useful for tabletop RPG session logs, forum roleplay, or any scenario where you need a realistic-looking comment thread.

## Features

- Add comments with a username and text body
- Drag and drop to reorder comments
- Inline edit any comment's username or text
- Delete individual comments or clear all
- Set a custom start timestamp and date — each comment is assigned an incrementing time from that point
- Live output preview formatted as:
  ```
  >>>>[comment text]<<<<
  —— Username [HH:MM:SS (UTC)  Month Day, Year]
  ```
- Copy the full formatted output to clipboard in one click
- Auto-saves your comment list to `localStorage` so your work persists between sessions

## Tech Stack

- [Vite](https://vitejs.dev/)
- [React 18](https://react.dev/)
- [Material UI v5](https://mui.com/)
- [@dnd-kit](https://dndkit.com/) for drag and drop

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. Set your desired start time (`HH:MM:SS`) and date (`YYYY-MM-DD`) at the top
2. Enter a username and comment text, then click "Add Comment"
3. Drag comments in the left column to reorder them — the output on the right updates live
4. Click the edit icon on any comment to modify its username or text
5. When you're happy with the order and content, click "Copy Output" to copy the formatted result to your clipboard

## localStorage

Your comment list is automatically saved to `localStorage` under the key `comments`. It will reload on your next visit. Use "Clear All" to wipe the list.
