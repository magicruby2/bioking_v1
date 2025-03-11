
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";
import { importanceGrades } from "./types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GradeFilterProps {
  selectedGrade: string;
  onSelectGrade: (gradeId: string) => void;
}

const GradeFilter = ({ selectedGrade, onSelectGrade }: GradeFilterProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <Flag className="h-4 w-4 mr-2 text-muted-foreground" />
        <h3 className="text-sm font-medium">Filter by Importance</h3>
      </div>
      
      <Tabs value={selectedGrade} onValueChange={onSelectGrade} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
          {importanceGrades.map((grade) => (
            <TabsTrigger 
              key={grade.id} 
              value={grade.id}
              className={`text-xs h-7 ${selectedGrade === grade.id ? grade.color.replace('bg-', 'bg-opacity-20 ') : ''}`}
            >
              {grade.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default GradeFilter;
