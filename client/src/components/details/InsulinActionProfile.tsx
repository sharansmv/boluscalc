import { useCalculator } from "@/contexts/CalculatorContext";
import { insulinTypes } from "@/lib/insulinTypes";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function InsulinActionProfile() {
  const { calculator, calculationResult } = useCalculator();
  
  if (!calculationResult) return null;

  const insulinType = insulinTypes[calculator.insulinType];
  
  // Generate data points for insulin action curve
  const generateActionCurve = () => {
    const data = [];
    const { onset, peak, duration } = insulinType;
    const peakHour = peak;
    const durationHours = duration;
    
    // Convert onset from minutes to hours
    const onsetHour = onset / 60;
    
    // Generate points for every 30 minutes up to duration
    for (let hour = 0; hour <= durationHours; hour += 0.5) {
      let activity = 0;
      
      // Before onset, no activity
      if (hour < onsetHour) {
        activity = 0;
      } 
      // Rising phase between onset and peak
      else if (hour >= onsetHour && hour <= peakHour) {
        activity = ((hour - onsetHour) / (peakHour - onsetHour)) * 100;
      } 
      // Falling phase between peak and duration
      else if (hour > peakHour && hour <= durationHours) {
        activity = 100 - ((hour - peakHour) / (durationHours - peakHour)) * 100;
      }
      
      data.push({ hour, activity: Math.max(0, Math.min(100, activity)) });
    }
    
    return data;
  };
  
  const actionCurveData = generateActionCurve();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold mb-2">Insulin Action Profile</h3>
      <div className="text-sm">
        <p>Using {insulinType.name}</p>
        <div className="mt-3 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={actionCurveData}
              margin={{ top: 5, right: 20, bottom: 20, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.3} />
              <XAxis 
                dataKey="hour" 
                label={{ value: 'Hours', position: 'bottom' }}
                tickFormatter={(value) => `${value}`}
                domain={[0, 'dataMax']}
              />
              <YAxis 
                label={{ 
                  value: 'Activity (%)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
                domain={[0, 100]}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Activity']}
                labelFormatter={(label) => `${label} hours`}
              />
              <Line 
                type="monotone" 
                dataKey="activity" 
                stroke="#0077cc" 
                strokeWidth={2} 
                dot={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 mt-3 text-xs text-gray-600 dark:text-gray-400">
          <div className="text-center">
            <p>Onset</p>
            <p className="font-medium">{insulinType.onset} minutes</p>
          </div>
          <div className="text-center">
            <p>Peak</p>
            <p className="font-medium">{insulinType.peak} hours</p>
          </div>
          <div className="text-center">
            <p>Duration</p>
            <p className="font-medium">{insulinType.duration} hours</p>
          </div>
        </div>
      </div>
    </div>
  );
}
