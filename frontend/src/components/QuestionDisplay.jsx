import React from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

const QuestionDisplay = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  questionNumber,
  totalQuestions,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      {/* Question Header */}
      <div className="mb-6 pb-4 border-b border-slate-200">
        <div className="text-sm font-medium text-slate-500 mb-2">
          Question {questionNumber} of {totalQuestions}
        </div>
        <h2 className="text-xl font-semibold text-slate-800 leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-4">
        <RadioGroup value={selectedAnswer} onValueChange={onAnswerSelect}>
          {question.options.map((option) => (
            <div
              key={option.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedAnswer === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
              onClick={() => onAnswerSelect(option.id)}
            >
              <div className="flex items-start gap-3">
                <RadioGroupItem value={option.id} id={option.id} className="mt-0.5" />
                <Label
                  htmlFor={option.id}
                  className="flex-1 cursor-pointer text-slate-700 font-medium"
                >
                  <span className="font-bold text-slate-900 mr-2">{option.id}.</span>
                  {option.text}
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default QuestionDisplay;