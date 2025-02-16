import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Research Paper Editor</h2>
      <Tabs defaultValue="title">
        <TabsList className="flex justify-center gap-4">
          <TabsTrigger value="title">Title & Abstract</TabsTrigger>
          <TabsTrigger value="introduction">Introduction</TabsTrigger>
          <TabsTrigger value="methods">Methodology</TabsTrigger>
          <TabsTrigger value="results">Results & Discussion</TabsTrigger>
          <TabsTrigger value="references">References</TabsTrigger>
        </TabsList>
        <div className="mt-6">
          <TabsContent value="title">
            <p className="text-gray-700">Title & Abstract Section Content...</p>
          </TabsContent>
          <TabsContent value="introduction">
            <p className="text-gray-700">Introduction Section Content...</p>
          </TabsContent>
          <TabsContent value="methods">
            <p className="text-gray-700">Methodology Section Content...</p>
          </TabsContent>
          <TabsContent value="results">
            <p className="text-gray-700">Results & Discussion Section Content...</p>
          </TabsContent>
          <TabsContent value="references">
            <p className="text-gray-700">Citations & References Section Content...</p>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default Dashboard;
