module.exports = async (params) => {
    const { app } = params;
    const archiveBase = "Tasks/Archive";

    // Get the currently active file
    const activeFile = app.workspace.getActiveFile();
    if (!activeFile) {
        new Notice("No active file found. Please open a note first.");
        return;
    }

    // Calculate ISO week number for a given date
    const getWeekNumber = (date) => {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    };

    // Parse completion date from task line (✅ YYYY-MM-DD)
    const parseCompletionDate = (line) => {
        const match = line.match(/✅\s*(\d{4})-(\d{2})-(\d{2})/);
        if (match) {
            return {
                year: match[1],
                month: match[2],
                day: match[3],
                dateStr: `${match[1]}-${match[2]}-${match[3]}`,
                date: new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]))
            };
        }
        return null;
    };

    // Read the active file
    const content = await app.vault.read(activeFile);
    const lines = content.split('\n');

    // Separate completed and incomplete tasks
    const completedTasks = [];
    const remainingLines = [];

    for (const line of lines) {
        if (line.match(/^- \[x\]/i)) {
            completedTasks.push(line);
        } else {
            remainingLines.push(line);
        }
    }

    if (completedTasks.length === 0) {
        new Notice("No completed tasks to archive");
        return;
    }

    // Group completed tasks by their completion date
    const tasksByDate = new Map();
    const now = new Date();
    const defaultYear = String(now.getFullYear());
    const defaultMonth = String(now.getMonth() + 1).padStart(2, '0');
    const defaultDay = String(now.getDate()).padStart(2, '0');
    const defaultDateStr = `${defaultYear}-${defaultMonth}-${defaultDay}`;

    for (const task of completedTasks) {
        const parsedDate = parseCompletionDate(task);
        
        if (parsedDate) {
            // Use the completion date from the task
            const dateKey = parsedDate.dateStr;
            if (!tasksByDate.has(dateKey)) {
                tasksByDate.set(dateKey, {
                    tasks: [],
                    year: parsedDate.year,
                    date: parsedDate.date
                });
            }
            tasksByDate.get(dateKey).tasks.push(task);
        } else {
            // Fallback to today's date if no completion date found
            if (!tasksByDate.has(defaultDateStr)) {
                tasksByDate.set(defaultDateStr, {
                    tasks: [],
                    year: defaultYear,
                    date: now
                });
            }
            tasksByDate.get(defaultDateStr).tasks.push(task);
        }
    }

    // Archive tasks to their respective dates
    let archivedCount = 0;
    for (const [dateStr, dateInfo] of tasksByDate) {
        const { tasks, year, date } = dateInfo;
        const weekNum = String(getWeekNumber(date)).padStart(2, '0');
        const archivePath = `${archiveBase}/${year}/${weekNum}/${dateStr}.md`;

        // Ensure archive folder exists
        const folderPath = `${archiveBase}/${year}/${weekNum}`;
        if (!app.vault.getAbstractFileByPath(folderPath)) {
            await app.vault.createFolder(folderPath);
        }

        // Get or create archive file
        let archiveTFile = app.vault.getAbstractFileByPath(archivePath);
        let existingContent = "";

        if (archiveTFile) {
            existingContent = await app.vault.read(archiveTFile);
            if (existingContent && !existingContent.endsWith('\n')) {
                existingContent += '\n';
            }
        }

        // Append tasks to archive file
        const newArchiveContent = existingContent + tasks.join('\n') + '\n';

        if (archiveTFile) {
            await app.vault.modify(archiveTFile, newArchiveContent);
        } else {
            await app.vault.create(archivePath, tasks.join('\n') + '\n');
        }

        archivedCount += tasks.length;
    }

    // Update the active file (remove completed tasks)
    const newContent = remainingLines.join('\n');
    await app.vault.modify(activeFile, newContent);

    const datesArchived = Array.from(tasksByDate.keys()).join(', ');
    new Notice(`Archived ${archivedCount} task(s) from ${activeFile.basename} to ${tasksByDate.size} date(s): ${datesArchived}`);
};
