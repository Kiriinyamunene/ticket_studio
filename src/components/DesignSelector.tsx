import { TicketDesign, ColorScheme } from "./TicketGenerator";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Eye } from "lucide-react";
import { useState } from "react";

interface DesignSelectorProps {
  designs: TicketDesign[];
  selectedDesign: TicketDesign;
  onDesignSelect: (design: TicketDesign) => void;
  customColors: ColorScheme;
  onColorChange: (colors: ColorScheme) => void;
  presetSchemes: Array<{
    name: string;
    colors: ColorScheme;
  }>;
}

// Helper function to convert hex to RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

// Helper function to convert RGB to hex
const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export const DesignSelector = ({ 
  designs, 
  selectedDesign, 
  onDesignSelect, 
  customColors, 
  onColorChange, 
  presetSchemes 
}: DesignSelectorProps) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const getDesignPreview = (designId: string) => {
    switch (designId) {
      case "sporty":
        return (
          <div className="p-1">
            <div className="w-full h-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-sm mb-1" />
            <div className="w-3/4 h-1 bg-yellow-500 rounded-sm" />
          </div>
        );
      case "dark":
        return (
          <div className="p-1">
            <div className="w-full h-2 bg-gray-600 rounded-sm mb-1" />
            <div className="w-3/4 h-1 bg-gray-500 rounded-sm" />
          </div>
        );
      case "elegant":
        return (
          <div className="p-1">
            <div className="w-full h-2 bg-slate-300 rounded-sm mb-1" />
            <div className="w-3/4 h-1 bg-slate-400 rounded-sm" />
          </div>
        );
      case "vibrant":
        return (
          <div className="p-1">
            <div className="w-full h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-sm mb-1" />
            <div className="w-3/4 h-1 bg-white/30 rounded-sm" />
          </div>
        );
      case "custom":
        return (
          <div className="p-1">
            <div 
              className="w-full h-2 rounded-sm mb-1" 
              style={{ background: customColors.background }}
            />
            <div 
              className="w-3/4 h-1 rounded-sm" 
              style={{ background: customColors.accent }}
            />
          </div>
        );
      default:
        return (
          <div className="p-1">
            <div className="w-full h-2 bg-gray-200 rounded-sm mb-1" />
            <div className="w-3/4 h-1 bg-gray-300 rounded-sm" />
          </div>
        );
    }
  };

  const handlePresetSelect = (scheme: { name: string; colors: ColorScheme }) => {
    onColorChange(scheme.colors);
  };

  const handleCustomColorChange = (field: keyof ColorScheme, value: string) => {
    const newColors = { ...customColors, [field]: value };
    
    // Update background gradient if primary or secondary changes
    if (field === 'primary' || field === 'secondary') {
      newColors.background = `linear-gradient(135deg, ${newColors.primary}, ${newColors.secondary})`;
    }
    
    onColorChange(newColors);
  };

  const handleRgbChange = (field: keyof ColorScheme, component: 'r' | 'g' | 'b', value: number) => {
    const currentRgb = hexToRgb(customColors[field]);
    const newRgb = { ...currentRgb, [component]: value };
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    
    handleCustomColorChange(field, newHex);
  };

  const RgbSlider = ({ 
    label, 
    field, 
    color 
  }: { 
    label: string; 
    field: keyof ColorScheme; 
    color: string; 
  }) => {
    const rgb = hexToRgb(color);
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-600">{label}</label>
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded border border-gray-300"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-gray-500 font-mono">{color}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-600 font-mono w-4">R</span>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.r}
              onChange={(e) => handleRgbChange(field, 'r', parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-xs text-gray-500 font-mono w-8">{rgb.r}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-green-600 font-mono w-4">G</span>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.g}
              onChange={(e) => handleRgbChange(field, 'g', parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-xs text-gray-500 font-mono w-8">{rgb.g}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-blue-600 font-mono w-4">B</span>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.b}
              onChange={(e) => handleRgbChange(field, 'b', parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-xs text-gray-500 font-mono w-8">{rgb.b}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Design Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {designs.map((design) => (
        <Card 
          key={design.id}
          className={`
              p-3 sm:p-4 cursor-pointer transition-all duration-200 hover:shadow-md
            ${selectedDesign.id === design.id 
                ? 'ring-2 ring-green-600 shadow-md border-green-600 bg-green-50' 
                : 'hover:border-green-300 hover:bg-gray-50'
            }
          `}
          onClick={() => onDesignSelect(design)}
        >
          <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{design.name}</h4>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{design.description}</p>
            </div>
            
            {/* Design Preview */}
              <div className="ml-3 flex-shrink-0">
              <div 
                className={`
                    w-12 h-8 sm:w-16 sm:h-10 rounded-md border-2 transition-all duration-200
                  ${design.className}
                  ${selectedDesign.id === design.id ? 'scale-110' : ''}
                `}
              >
                  {getDesignPreview(design.id)}
              </div>
            </div>
          </div>
        </Card>
      ))}
      </div>

      {/* Color Customization */}
      {selectedDesign.id === "custom" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Color Customization</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="text-xs"
            >
              {showColorPicker ? <Eye className="w-3 h-3 mr-1" /> : <Palette className="w-3 h-3 mr-1" />}
              {showColorPicker ? "Hide" : "Customize"}
            </Button>
          </div>

          {showColorPicker && (
            <div className="space-y-4">
              {/* Preset Color Schemes */}
              <div>
                <h5 className="text-xs font-medium text-gray-600 mb-2">Preset Schemes</h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {presetSchemes.map((scheme) => (
                    <button
                      key={scheme.name}
                      onClick={() => handlePresetSelect(scheme)}
                      className="p-2 rounded border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div 
                        className="w-full h-8 rounded mb-1"
                        style={{ background: scheme.colors.background }}
                      />
                      <p className="text-xs text-gray-600 truncate">{scheme.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom RGB Color Picker */}
              <div>
                <h5 className="text-xs font-medium text-gray-600 mb-3">Custom RGB Colors</h5>
                <div className="space-y-4">
                  <RgbSlider 
                    label="Primary Color" 
                    field="primary" 
                    color={customColors.primary} 
                  />
                  <RgbSlider 
                    label="Secondary Color" 
                    field="secondary" 
                    color={customColors.secondary} 
                  />
                  <RgbSlider 
                    label="Accent Color" 
                    field="accent" 
                    color={customColors.accent} 
                  />
                  <RgbSlider 
                    label="Text Color" 
                    field="text" 
                    color={customColors.text} 
                  />
                </div>
              </div>

              {/* Preview of Custom Colors */}
              <div>
                <h5 className="text-xs font-medium text-gray-600 mb-2">Preview</h5>
                <div 
                  className="w-full h-12 rounded border border-gray-300"
                  style={{ background: customColors.background }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};