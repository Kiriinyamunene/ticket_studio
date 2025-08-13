import { TicketDesign } from "./TicketGenerator";
import { Card } from "@/components/ui/card";

interface DesignSelectorProps {
  designs: TicketDesign[];
  selectedDesign: TicketDesign;
  onDesignSelect: (design: TicketDesign) => void;
}

export const DesignSelector = ({ designs, selectedDesign, onDesignSelect }: DesignSelectorProps) => {
  return (
    <div className="grid grid-cols-1 gap-3">
      {designs.map((design) => (
        <Card 
          key={design.id}
          className={`
            p-4 cursor-pointer transition-all duration-200 hover:shadow-glow
            ${selectedDesign.id === design.id 
              ? 'ring-2 ring-primary shadow-glow border-primary' 
              : 'hover:border-primary/50'
            }
          `}
          onClick={() => onDesignSelect(design)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">{design.name}</h4>
              <p className="text-sm text-muted-foreground">{design.description}</p>
            </div>
            
            {/* Design Preview */}
            <div className="ml-4">
              <div 
                className={`
                  w-16 h-10 rounded-md border-2 transition-all duration-200
                  ${design.className}
                  ${selectedDesign.id === design.id ? 'scale-110' : ''}
                `}
              >
                <div className="w-full h-1 rounded-t-sm bg-gradient-primary" />
                {design.id === 'concert' && (
                  <div className="p-1">
                    <div className="w-full h-2 bg-white/20 rounded-sm mb-1" />
                    <div className="w-3/4 h-1 bg-white/30 rounded-sm" />
                  </div>
                )}
                {design.id === 'classic' && (
                  <div className="p-1">
                    <div className="w-full h-2 bg-gray-200 rounded-sm mb-1" />
                    <div className="w-3/4 h-1 bg-gray-300 rounded-sm" />
                  </div>
                )}
                {design.id === 'modern' && (
                  <div className="p-1">
                    <div className="w-full h-2 bg-primary/20 rounded-sm mb-1" />
                    <div className="w-3/4 h-1 bg-primary/30 rounded-sm" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};