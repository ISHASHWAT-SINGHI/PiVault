import { Button } from './ui/button';

export default function UpgradeCard() {
  return (
    <div className="relative bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-6 lg:p-8 overflow-hidden shadow-lg">
      <div className="relative z-10 max-w-md">
        <h2 className="text-white mb-2">Upgrade to pro for your unlimited latest storage</h2>
        <Button className="bg-white text-purple-600 hover:bg-slate-100 mt-4 shadow-lg">
          Upgrade Now
        </Button>
      </div>
      
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 lg:w-64 h-48 lg:h-64 opacity-20">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#FFFFFF"
            d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.8C64.8,56.4,53.8,69,40.2,77.1C26.6,85.2,10.4,88.8,-5.4,87.3C-21.2,85.8,-42.4,79.2,-58.3,68.6C-74.2,58,-84.8,43.4,-89.7,27.1C-94.6,10.8,-93.8,-7.2,-87.8,-22.8C-81.8,-38.4,-70.6,-51.6,-57.2,-59.1C-43.8,-66.6,-28.2,-68.4,-13.4,-71.1C1.4,-73.8,30.6,-83.6,44.7,-76.4Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>
    </div>
  );
}