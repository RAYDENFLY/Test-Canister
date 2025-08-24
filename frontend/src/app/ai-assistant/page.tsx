import TopNavigation from "@/components/layout/TopNavigation";
import AIAssistant from "@/components/ai/AIAssistant";

export default function AIAssistantPage() {
  return (
    <>
      <TopNavigation />
      <div className="pt-16">
        <AIAssistant />
      </div>
    </>
  );
}