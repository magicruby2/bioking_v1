
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";
import { importanceGrades } from "./types";

interface GradeFilterProps {
  selectedGrade: string;
  onSelectGrade: (gradeId: string) => void;
}

const GradeFilter = ({ selectedGrade, onSelectGrade }: GradeFilterProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <Flag className="h-4 w-4 mr-2 text-muted-foreground" />
        <h3 className="text-sm font-medium">Filter by Importance</h3>
      </div>
      
      <div className="flex flex-col space-y-1">
        {importanceGrades.map((grade) => (
          <button
            key={grade.id}
            onClick={() => onSelectGrade(grade.id)}
            className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedGrade === grade.id
                ? `${grade.color} text-white`
                : 'hover:bg-secondary/80'
            }`}
          >
            {grade.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GradeFilter;
