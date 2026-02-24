# Obsidian Task Archiver

A QuickAdd macro that automatically archives completed tasks from your daily task file to date-specific archive files.

## Features

- **Automatic completion date detection**: Archives tasks based on their `✅ YYYY-MM-DD` completion date
- **Smart grouping**: Tasks completed on different dates go to different archive files
- **Week-based organization**: Creates archive structure `Archive/{year}/{week}/{date}.md`
- **Fallback support**: Tasks without completion dates are archived to today's date
- **Preserves format**: Maintains your existing task format including tags

## Requirements

- [Obsidian](https://obsidian.md/) (v1.0.0 or later)
- [QuickAdd](https://github.com/chhoumann/quickadd) plugin (v0.13.0 or later)
- [Tasks](https://github.com/obsidian-tasks-group/obsidian-tasks) plugin (optional but recommended for completion dates)

## Installation

### Step 1: Install Script

1. Create a folder `Scripts` in your vault root
2. Copy `archiveCompleted.js` from this repo to `Scripts/archiveCompleted.js`

### Step 2: Configure QuickAdd

1. Open **Settings** → **QuickAdd**
2. In the text box at the top, type: `Archive Completed Tasks`
3. Select **Macro** from the dropdown
4. Click **Add Choice**
5. Click the **cog icon (⚙️)** next to "Archive Completed Tasks"
6. Click **Configure Macro**
7. Select **User Scripts** from the dropdown
8. Click **Add**
9. Select `archiveCompleted` from the list
10. Go back to QuickAdd main settings
11. Click the **lightning bolt** icon next to "Archive Completed Tasks" to enable it as a command

### Step 3: Assign Hotkey

1. Go to **Settings** → **Hotkeys**
2. Search for "Archive Completed Tasks"
3. Assign your preferred shortcut (e.g., `Ctrl+Shift+A`)

## Usage

1. Complete tasks in your `Tasks/Today.md` file (check the box)
2. Press your assigned hotkey (default: `Ctrl+Shift+A`)
3. All completed tasks are automatically moved to their respective date files in `Tasks/Archive/`

### Example

**Before (Tasks/Today.md):**
```markdown
- [x] Task A ✅ 2026-02-03
- [x] Task B ✅ 2026-02-04
- [x] Task C ✅ 2026-02-03
- [ ] Task D (incomplete)
```

**After running the macro:**
- Tasks A and C → `Tasks/Archive/2026/06/2026-02-03.md`
- Task B → `Tasks/Archive/2026/06/2026-02-04.md`
- Task D stays in `Tasks/Today.md`

## Archive Structure

```
Tasks/
├── Archive/
│   ├── 2026/
│   │   ├── 05/
│   │   │   └── 2026-01-28.md
│   │   ├── 06/
│   │   │   ├── 2026-02-03.md
│   │   │   └── 2026-02-04.md
│   │   └── ...
│   └── ...
└── Today.md
```

## Configuration

The script uses these default paths (edit the script to customize):
- **Source file**: `Tasks/Today.md`
- **Archive base**: `Tasks/Archive`

## How It Works

1. **Reads** your source task file (e.g., `Tasks/Today.md`)
2. **Identifies** completed tasks (lines starting with `- [x]`)
3. **Parses** the completion date from the `✅ YYYY-MM-DD` marker
4. **Groups** tasks by their completion date
5. **Creates** archive folders and files as needed (`{year}/{week}/{date}.md`)
6. **Appends** tasks to their respective archive files
7. **Removes** archived tasks from the source file
8. **Shows** a notification with archive summary

## Troubleshooting

**"Could not find Tasks/Today.md"**
- Ensure your source file exists at `Tasks/Today.md`
- Edit the script to match your file path

**"User script not found"**
- Make sure `archiveCompleted.js` is in the `Scripts` folder in your vault root
- Check the file name matches exactly (case-sensitive)

**Tasks not archiving**
- Make sure you're using the Tasks plugin format: `- [x] Task text ✅ YYYY-MM-DD`
- Check the console for errors (Ctrl+Shift+I)

**No archive folder created**
- The script creates folders automatically
- Ensure you have write permissions in your vault

## License

MIT

## Contributing

Feel free to submit issues or pull requests to improve this macro!
