import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const QuestionNavigation = ({
  questions,
  currentQuestionIndex,
  questionStatus,
  userAnswers,
  onQuestionClick,
}) => {
  const getQuestionStatusStyle = (questionId, index) => {
    const status = questionStatus[questionId];
    const isActive = index === currentQuestionIndex;

    // Default - not visited (white)
    let bgColor = 'bg-white border-slate-300';
    let textColor = 'text-slate-800';
    let showDot = false;

    if (status === 'visited') {
      // Visited but not answered - red
      bgColor = 'bg-red-500 border-red-600';
      textColor = 'text-white';
    } else if (status === 'answered') {
      // Answered - green
      bgColor = 'bg-emerald-500 border-emerald-600';
      textColor = 'text-white';
    } else if (status === 'marked') {
      // Marked for review (no answer) - purple
      bgColor = 'bg-purple-500 border-purple-600';
      textColor = 'text-white';
    } else if (status === 'answered-marked') {
      // Answered and marked for review - purple with green dot
      bgColor = 'bg-purple-500 border-purple-600';
      textColor = 'text-white';
      showDot = true;
    }

    return {
      bgColor,
      textColor,
      showDot,
      isActive,
    };
  };

  const getStatusCounts = () => {
    let answered = 0;
    let notAnswered = 0;
    let marked = 0;
    let notVisited = 0;

    questions.forEach((q) => {
      const status = questionStatus[q.id];
      if (!status) {
        notVisited++;
      } else if (status === 'answered') {
        answered++;
      } else if (status === 'visited') {
        notAnswered++;
      } else if (status === 'marked' || status === 'answered-marked') {
        marked++;
      }
    });

    return { answered, notAnswered, marked, notVisited };
  };

  const counts = getStatusCounts();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Question Palette</h3>

      {/* Question Grid */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {questions.map((question, index) => {
          const { bgColor, textColor, showDot, isActive } = getQuestionStatusStyle(
            question.id,
            index
          );

          return (
            <button
              key={question.id}
              onClick={() => onQuestionClick(index)}
              className={`relative w-full aspect-square rounded-lg border-2 font-semibold text-sm transition-all ${
                bgColor
              } ${textColor} ${
                isActive ? 'ring-2 ring-blue-400 ring-offset-2' : ''
              } hover:scale-105`}
            >
              {index + 1}
              {showDot && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-emerald-500 border-2 border-emerald-600"></div>
          <span className="text-sm text-slate-700">Answered ({counts.answered})</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-red-500 border-2 border-red-600"></div>
          <span className="text-sm text-slate-700">Not Answered ({counts.notAnswered})</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-6 h-6 rounded bg-purple-500 border-2 border-purple-600">
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-white" />
          </div>
          <span className="text-sm text-slate-700">Marked ({counts.marked})</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-white border-2 border-slate-300"></div>
          <span className="text-sm text-slate-700">Not Visited ({counts.notVisited})</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionNavigation;