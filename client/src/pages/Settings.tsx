import { Link } from "wouter";
import GeneralSettings from "@/components/settings/GeneralSettings";
import HourlyCarbRatios from "@/components/settings/HourlyCarbRatios";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <Link href="/" className="flex-1 py-2 px-4 rounded-md text-center font-medium text-sm bg-gray-200 dark:bg-gray-700">
          Calculator
        </Link>
        <Link href="/settings" className="flex-1 py-2 px-4 rounded-md text-center font-medium text-sm bg-primary-500 text-white">
          Settings
        </Link>
      </div>

      <GeneralSettings />
      <HourlyCarbRatios />
    </div>
  );
}
