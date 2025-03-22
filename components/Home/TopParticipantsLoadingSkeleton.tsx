const LoadingSkeleton = () => (
  <div className="space-y-6">
    {[...Array(5)].map((_, index) => (
      <div key={index} className="space-y-2">
        <div className="bg-[#343434] p-4 rounded-lg border border-gray-700 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-700" />
              <div className="w-36">
                <div className="h-4 bg-gray-700 rounded w-24" />
                <div className="h-3 bg-gray-700 rounded w-16 mt-1" />
              </div>
            </div>
            <div className="text-right">
              <div className="h-5 bg-gray-700 rounded w-12" />
              <div className="h-3 bg-gray-700 rounded w-8 mt-1" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default LoadingSkeleton;
