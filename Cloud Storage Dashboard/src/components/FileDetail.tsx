interface FileDetailProps {
  file: {
    name: string;
    thumbnail: string;
    size: string;
  };
}

export default function FileDetail({ file }: FileDetailProps) {
  const details = [
    { label: 'Type', value: 'Document' },
    { label: 'Size', value: file.size },
    { label: 'Owner', value: 'Andrea' },
    { label: 'Modified', value: 'March 25, 2024' },
    { label: 'Opened', value: '12:56 AM' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
      <img
        src={file.thumbnail}
        alt={file.name}
        className="w-full h-40 object-cover rounded-xl mb-4"
      />
      
      <h3 className="text-slate-900 dark:text-white mb-4">{file.name}</h3>
      
      <div className="space-y-3">
        {details.map((detail) => (
          <div key={detail.label} className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-500 text-sm">{detail.label}</span>
            <span className="text-slate-900 dark:text-white text-sm">{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}