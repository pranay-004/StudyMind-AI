/**
 * Helper to download content as a file.
 */
export const downloadFile = (content, fileName, contentType) => {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
};

/**
 * Exports flashcards as a CSV file.
 */
export const exportFlashcardsCSV = (flashcards) => {
  if (!flashcards || flashcards.length === 0) return;
  
  // CSV Headers
  let csvContent = "Question,Answer\n";
  
  // Escape double quotes and format
  flashcards.forEach(card => {
    const q = card.question.replace(/"/g, '""');
    const a = card.answer.replace(/"/g, '""');
    csvContent += `"${q}","${a}"\n`;
  });
  
  downloadFile(csvContent, 'study_assistant_flashcards.csv', 'text/csv;charset=utf-8;');
};

/**
 * Exports quiz questions as a text study sheet.
 */
export const exportQuizTXT = (quiz) => {
  if (!quiz || quiz.length === 0) return;
  
  let txtContent = "=== STUDY ASSISTANT QUIZ ===\n\n";
  
  quiz.forEach((item, index) => {
    txtContent += `${index + 1}. ${item.question}\n`;
    item.options.forEach((opt, idx) => {
      const label = ['A', 'B', 'C', 'D'][idx];
      txtContent += `   [ ] ${label}) ${opt}\n`;
    });
    txtContent += `   Correct Answer: ${item.correct}\n\n`;
  });
  
  downloadFile(txtContent, 'study_assistant_quiz.txt', 'text/plain;charset=utf-8;');
};

/**
 * Exports the entire study material as a beautiful markdown guide.
 */
export const exportStudyGuideMarkdown = (notes, flashcards, quiz) => {
  let md = `# Study Guide: Generated Topic\n\n`;
  
  if (notes) {
    md += `## Original Source Notes\n`;
    md += `> ${notes.split('\n').join('\n> ')}\n\n`;
  }
  
  if (flashcards && flashcards.length > 0) {
    md += `## Flashcards (${flashcards.length})\n\n`;
    flashcards.forEach((card, idx) => {
      md += `### Card ${idx + 1}\n`;
      md += `**Question:** ${card.question}\n\n`;
      md += `**Answer:** *${card.answer}*\n\n`;
      md += `---\n\n`;
    });
  }
  
  if (quiz && quiz.length > 0) {
    md += `## Quiz (${quiz.length} Questions)\n\n`;
    quiz.forEach((item, idx) => {
      md += `### Q${idx + 1}. ${item.question}\n`;
      item.options.forEach((opt, optIdx) => {
        const marker = opt === item.correct ? '* [x]' : '  [ ]';
        md += `${marker} ${opt}\n`;
      });
      md += `\n`;
    });
  }
  
  downloadFile(md, 'study_guide.md', 'text/markdown;charset=utf-8;');
};

/**
 * LocalStorage management for history.
 */
const HISTORY_KEY = 'study_assistant_history_v1';

export const getHistory = () => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to parse history from localStorage", e);
    return [];
  }
};

export const saveSession = (notes, data) => {
  try {
    const history = getHistory();
    const newSession = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      notes: notes.slice(0, 120) + (notes.length > 120 ? '...' : ''),
      fullNotes: notes,
      data
    };
    
    // Keep max 10 sessions in history
    const updated = [newSession, ...history.slice(0, 9)];
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to save session to localStorage", e);
    return getHistory();
  }
};

export const deleteSession = (id) => {
  try {
    const history = getHistory();
    const updated = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to delete session", e);
    return getHistory();
  }
};
