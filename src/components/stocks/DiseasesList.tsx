
import { Pill, Newspaper } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

// Mock data for diseases
const diseases = [
  { name: "Diabetes", description: "Type 1 and Type 2 diabetes management", weeklyNews: "New insulin delivery system shows promising results in clinical trials. Eli Lilly announced expansion of its diabetes product line." },
  { name: "Hypertension", description: "High blood pressure treatments", weeklyNews: "Recent study shows combination therapy more effective for resistant hypertension. New guidelines published for blood pressure management in elderly patients." },
  { name: "Cancer", description: "Various oncology treatments", weeklyNews: "Breakthrough in immunotherapy shows 40% improvement in survival rates for specific lung cancers. FDA approves new targeted therapy for rare form of leukemia." },
  { name: "Alzheimer's", description: "Neurodegenerative disease treatments", weeklyNews: "Promising results from Phase III trials of new Alzheimer's drug targeting amyloid plaques. New diagnostic tool allows earlier detection of cognitive decline." },
  { name: "Rheumatoid Arthritis", description: "Autoimmune condition treatments", weeklyNews: "New biologic therapy shows significant reduction in joint damage progression. Extended release formulation approved for once-monthly dosing." },
  { name: "Asthma/COPD", description: "Respiratory condition treatments", weeklyNews: "Triple combination inhaler therapy demonstrates superior outcomes in severe asthma patients. New rescue inhaler formulation approved with longer-lasting bronchodilation." },
];

const DiseasesList = () => {
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleDiseaseClick = (diseaseName: string) => {
    setSelectedDisease(diseaseName);
    setIsOpen(true);
  };
  
  const selectedDiseaseData = diseases.find(disease => disease.name === selectedDisease);
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {diseases.map((disease) => (
          <Card 
            key={disease.name} 
            className="hover:shadow-md transition-all cursor-pointer"
            onClick={() => handleDiseaseClick(disease.name)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center">
                    <Pill className="h-4 w-4 mr-2 text-blue-500" />
                    <p className="font-medium">{disease.name}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{disease.description}</p>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="ml-2">
                        <Newspaper className="h-4 w-4 text-blue-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View weekly news</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Pill className="h-5 w-5 mr-2 text-blue-500" />
              {selectedDiseaseData?.name} - Weekly News Summary
            </DialogTitle>
            <DialogDescription>
              Latest pharmaceutical developments for {selectedDiseaseData?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-muted/30 rounded-md">
            {selectedDiseaseData?.weeklyNews}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DiseasesList;
