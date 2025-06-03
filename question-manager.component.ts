import { Component } from '@angular/core';

interface Question {
  id: string;
  text: string;
  answer?: string;
}

@Component({
  selector: 'app-question-manager',
  templateUrl: './question-manager.component.html',
  styleUrls: ['./question-manager.component.css']
})
export class QuestionManagerComponent {
  questions: Question[] = [];
  newQuestion = '';
  editingId: string | null = null;
  editingText = '';

  predefinedQuestions = [
    "What is the main topic of this document?",
    "Can you summarize the key points?",
    "What are the important dates mentioned?",
    "Who are the main stakeholders mentioned?",
    "What are the financial figures discussed?",
    "What recommendations are provided?"
  ];

  addQuestion(text: string) {
    if (text.trim()) {
      const newQ: Question = {
        id: Date.now().toString(),
        text: text.trim()
      };
      this.questions.push(newQ);
      this.newQuestion = '';
    }
  }

  deleteQuestion(id: string) {
    this.questions = this.questions.filter(q => q.id !== id);
  }

  startEdit(question: Question) {
    this.editingId = question.id;
    this.editingText = question.text;
  }

  saveEdit() {
    if (this.editingId && this.editingText.trim()) {
      const index = this.questions.findIndex(q => q.id === this.editingId);
      if (index !== -1) {
        this.questions[index].text = this.editingText.trim();
      }
      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.editingId = null;
    this.editingText = '';
  }

  addPredefinedQuestion(questionText: string) {
    this.addQuestion(questionText);
  }

  async submitQuestions() {
    const updatedQuestions = await Promise.all(
      this.questions.map(async (question) => {
        if (!question.answer) {
          const response = await this.mockApiCall(question.text);
          return { ...question, answer: response.answer };
        }
        return question;
      })
    );
    this.questions = updatedQuestions;
  }

  async mockApiCall(questionText: string): Promise<{ answer: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { answer: `This is a mock answer for: "${questionText}"` };
  }

  exportToExcel() {
    console.log('Exporting to Excel...', this.questions);
    // Add actual Excel export logic here
  }
}