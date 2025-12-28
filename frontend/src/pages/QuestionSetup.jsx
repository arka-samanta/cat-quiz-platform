import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, PlayCircle, Upload, Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';

const QuestionSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: '',
      options: [
        { id: 'A', text: '' },
        { id: 'B', text: '' },
        { id: 'C', text: '' },
        { id: 'D', text: '' },
      ],
      correctAnswer: '',
    },
  ]);

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      question: '',
      options: [
        { id: 'A', text: '' },
        { id: 'B', text: '' },
        { id: 'C', text: '' },
        { id: 'D', text: '' },
      ],
      correctAnswer: '',
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id) => {
    if (questions.length === 1) {
      toast({
        title: 'Cannot Remove',
        description: 'At least one question is required.',
        variant: 'destructive',
      });
      return;
    }
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const updateOption = (questionId, optionId, text) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt) =>
                opt.id === optionId ? { ...opt, text } : opt
              ),
            }
          : q
      )
    );
  };

  const validateQuestions = () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        toast({
          title: 'Validation Error',
          description: `Question ${i + 1} text is empty.`,
          variant: 'destructive',
        });
        return false;
      }
      for (let opt of q.options) {
        if (!opt.text.trim()) {
          toast({
            title: 'Validation Error',
            description: `Question ${i + 1} has an empty option.`,
            variant: 'destructive',
          });
          return false;
        }
      }
      if (!q.correctAnswer) {
        toast({
          title: 'Validation Error',
          description: `Question ${i + 1} has no correct answer selected.`,
          variant: 'destructive',
        });
        return false;
      }
    }
    return true;
  };

  const startExam = () => {
    if (!validateQuestions()) return;

    // Store questions in localStorage
    localStorage.setItem('examQuestions', JSON.stringify(questions));
    
    toast({
      title: 'Exam Ready!',
      description: `${questions.length} questions loaded successfully.`,
    });

    // Navigate to exam page
    navigate('/exam');
  };

  const exportQuestions = () => {
    const dataStr = JSON.stringify(questions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `CAT_Questions_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: 'Questions Exported',
      description: 'Questions saved as JSON file.',
    });
  };

  const importQuestions = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        
        // Check if it's the new format with "questions" array
        let questionsToImport = imported;
        
        if (imported.questions && Array.isArray(imported.questions)) {
          // Convert from uploaded format to our internal format
          questionsToImport = imported.questions.map((q) => ({
            id: q.question_id,
            question: q.question,
            options: [
              { id: 'A', text: q.options.A },
              { id: 'B', text: q.options.B },
              { id: 'C', text: q.options.C },
              { id: 'D', text: q.options.D },
            ],
            correctAnswer: q.correct_option,
          }));
        }
        
        setQuestions(questionsToImport);
        toast({
          title: 'Questions Imported',
          description: `${questionsToImport.length} questions loaded successfully.`,
        });
      } catch (error) {
        toast({
          title: 'Import Error',
          description: 'Invalid JSON file format.',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">CAT Exam Setup</h1>
              <p className="text-sm text-slate-600 mt-1">
                Add questions with options and mark the correct answer
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label>
                <input
                  type="file"
                  accept=".json"
                  onChange={importQuestions}
                  className="hidden"
                />
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Import JSON
                  </span>
                </Button>
              </label>
              <Button variant="outline" onClick={exportQuestions}>
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
              <Button
                onClick={startExam}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Start Exam ({questions.length} Questions)
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Question List */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {questions.map((q, qIndex) => (
            <Card key={q.id} className="border-2 border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50 border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-bold text-slate-800">
                    Question {qIndex + 1}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(q.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Question Text */}
                <div>
                  <Label htmlFor={`question-${q.id}`} className="text-slate-700 font-semibold mb-2 block">
                    Question Text
                  </Label>
                  <Input
                    id={`question-${q.id}`}
                    value={q.question}
                    onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
                    placeholder="Enter the question..."
                    className="text-base"
                  />
                </div>

                {/* Options */}
                <div>
                  <Label className="text-slate-700 font-semibold mb-3 block">Options</Label>
                  <div className="space-y-3">
                    {q.options.map((opt) => (
                      <div key={opt.id} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-700">
                          {opt.id}
                        </div>
                        <Input
                          value={opt.text}
                          onChange={(e) => updateOption(q.id, opt.id, e.target.value)}
                          placeholder={`Option ${opt.id}`}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Correct Answer */}
                <div>
                  <Label className="text-slate-700 font-semibold mb-3 block">
                    Correct Answer
                  </Label>
                  <RadioGroup
                    value={q.correctAnswer}
                    onValueChange={(value) => updateQuestion(q.id, 'correctAnswer', value)}
                  >
                    <div className="flex gap-4">
                      {q.options.map((opt) => (
                        <div key={opt.id} className="flex items-center gap-2">
                          <RadioGroupItem value={opt.id} id={`correct-${q.id}-${opt.id}`} />
                          <Label
                            htmlFor={`correct-${q.id}-${opt.id}`}
                            className="cursor-pointer font-semibold text-slate-700"
                          >
                            {opt.id}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Question Button */}
        <div className="mt-6 text-center">
          <Button
            onClick={addQuestion}
            variant="outline"
            className="border-2 border-dashed border-slate-300 hover:border-slate-400 w-full py-6"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Another Question
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionSetup;